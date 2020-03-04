import { Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnInit, HostBinding, Renderer2, NgZone, OnDestroy } from '@angular/core';
import { DndService } from '../dnd.service';
import { DomHelper } from '../dom-helper';

@Directive({
    selector: '[draggable]'
})
/**
 * Makes an element draggable by adding the draggable html attribute
 */
export class Draggable implements OnInit, OnDestroy {
    /**
     * The data that will be available to the droppable directive on its `onDrop()` event.
     */
    @Input() dragData: any;

    /**
     * The selector that defines the drag Handle.
     * If defined drag will only be allowed if dragged from the selector element.
     */
    @Input() dragHandle: string;

    /**
     * Defines compatible drag drop pairs. Values must match both in draggable and droppable.dropScope.
     */
    @Input() dragScope: string | Array<string> = 'default';

    /**
     * The CSS class applied to a draggable element. If a dragHandle is defined then its applied to that handle
     * element only. By default it is used to change the mouse over pointer.
     */
    @Input() dragHandleClass = 'drag-handle';

    /**
     * CSS class applied on the source draggable element while being dragged.
     */
    @Input() dragClass = 'drag-border';

    /**
     * CSS class applied on the drag ghost when being dragged.
     */
    @Input() dragTransitClass = 'drag-transit';

    /**
     * The url to image that will be used as custom drag image when the draggable is being dragged.
     */
    @Input() set dragImage(value: string) {
        this._dragImage = value;
        this.dragImageElement = new Image();
        this.dragImageElement.src = this.dragImage;
    }

    get dragImage() {
        return this._dragImage;
    }

    /**
     * Defines if drag is enabled. `true` by default.
     */
    @HostBinding('draggable')
    @Input() set dragEnabled(value: boolean) {
        this._dragEnabled = value;
        this.applyDragHandleClass();
    };

    get dragEnabled() {
        return this._dragEnabled;
    }

    /**
     * Event fired when Drag is started
     */
    @Output() onDragStart: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired while the element is being dragged
     */
    @Output() onDrag: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired when drag ends
     */
    @Output() onDragEnd: EventEmitter<any> = new EventEmitter();

    /**
     * @private
     * Keeps track of mouse over element that is used to determine drag handles
     */
    private mouseDownElement: any;

    /**
     * @private
     * Backing field for the dragEnabled property
     */
    private _dragEnabled = true;

    /**
     * @private
     * Backing field for the dragImage property
     */
    private _dragImage: string;

    /**
     * @private
     * Image element for the dragImage
     */
    private dragImageElement: HTMLImageElement;

    /**
     * @private
     * Function for unbinding the drag listener
     */
    private unbindDragListener: Function;

    constructor(protected hostElement: ElementRef, private renderer: Renderer2,
        private dndService: DndService, private zone: NgZone) {
    }

    ngOnInit() {
        this.applyDragHandleClass();
    }

    ngOnDestroy() {
        this.unbindDragListeners();
    }

    @HostListener('dragstart', ['$event'])
    dragStart(e) {
        if (this.allowDrag()) {

            this.renderer.addClass(this.hostElement.nativeElement, this.dragTransitClass);
            setTimeout(() => {
                this.renderer.addClass(this.hostElement.nativeElement, this.dragClass);
                this.renderer.removeClass(this.hostElement.nativeElement, this.dragTransitClass);
            }, 10);

            this.dndService.dragData = this.dragData;
            this.dndService.scope = this.dragScope;

            // Firefox requires setData() to be called otherwise the drag does not work.
            // We don't use setData() to transfer data anymore so this is just a dummy call.
            if (e.dataTransfer != null) {
                e.dataTransfer.setData('text', '');
            }

            // Set dragImage
            if (this.dragImage) {
                e.dataTransfer.setDragImage(this.dragImageElement, 0, 0);
            }

            e.stopPropagation();
            this.onDragStart.emit(e);
            this.dndService.onDragStart.next();

            this.zone.runOutsideAngular(() => {
                this.unbindDragListener = this.renderer.listen(this.hostElement.nativeElement, 'drag', (dragEvent) => {
                    this.drag(dragEvent);
                });
            });
        } else {
            e.preventDefault();
        }
    }

    drag(e) {
        this.onDrag.emit(e);
    }

    @HostListener('dragend', ['$event'])
    dragEnd(e) {
        this.unbindDragListeners();
        DomHelper.removeClass(this.hostElement, this.dragClass);
        this.dndService.onDragEnd.next();
        this.onDragEnd.emit(e);
        e.stopPropagation();
        e.preventDefault();
    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    mousedown(e) {
        this.mouseDownElement = e.target;
    }

    private allowDrag() {
        if (this.dragHandle) {
            return DomHelper.matches(this.mouseDownElement, this.dragHandle) && this.dragEnabled;
        } else {
            return this.dragEnabled;
        }
    }

    private applyDragHandleClass() {
        let dragElement = this.getDragHandleElement();

        if (!dragElement) {
            return;
        }

        if (this.dragEnabled) {
            DomHelper.addClass(dragElement, this.dragHandleClass);
        } else {
            DomHelper.removeClass(this.hostElement, this.dragHandleClass);
        }
    }

    private getDragHandleElement() {
        let dragElement = this.hostElement;
        if (this.dragHandle) {
            dragElement = this.hostElement.nativeElement.querySelector(this.dragHandle);
        }

        return dragElement;
    }

    unbindDragListeners() {
        if (this.unbindDragListener) {
            this.unbindDragListener();
        }
    }
}