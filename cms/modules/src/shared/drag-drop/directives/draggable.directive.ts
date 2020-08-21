import {
    Directive, ElementRef, EventEmitter, HostBinding, HostListener,
    Input, NgZone, OnDestroy, Output, Renderer2, ViewChild
} from '@angular/core';
import { DndService } from '../dnd.service';
import { DragHandle } from './drag-handle.directive';

@Directive({
    selector: '[draggable]'
})
/**
 * Makes an element draggable by adding the draggable html attribute
 */
export class Draggable implements OnDestroy {

    /**
     * The element that defines the drag Handle.
     * If defined drag will only be allowed if dragged from the selector element.
     */
    @ViewChild(DragHandle, { static: true, read: ElementRef }) dragHandleElement: ElementRef;

    /**
     * The data that will be available to the droppable directive on its `onDrop()` event.
     */
    @Input() dragData: any;

    /**
     * Defines compatible drag drop pairs. Values must match both in draggable and droppable.dropScope.
     */
    @Input() dragScope: string | string[] = 'default';

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
    @Input()
    get dragImage() {
        return this._dragImage;
    }
    set dragImage(value: string) {
        this._dragImage = value;
        this.dragImageElement = new Image();
        this.dragImageElement.src = this.dragImage;
    }

    /**
     * Defines if drag is enabled. `true` by default.
     */
    @HostBinding('draggable')
    @Input()
    get dragEnabled() {
        return this._dragEnabled;
    }
    set dragEnabled(value: boolean) {
        this._dragEnabled = value;
    }

    /**
     * Event fired when Drag is started
     */
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onDragStart: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired while the element is being dragged
     */
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onDrag: EventEmitter<any> = new EventEmitter();

    /**
     * Event fired when drag ends
     */
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onDragEnd: EventEmitter<any> = new EventEmitter();

    /**
     * Keeps track of mouse over element that is used to determine drag handles
     */
    private mouseDownElement: any;

    /**
     * Backing field for the dragEnabled property
     */
    private _dragEnabled = true;

    /**
     * Backing field for the dragImage property
     */
    private _dragImage: string;

    /**
     * Image element for the dragImage
     */
    private dragImageElement: HTMLImageElement;

    /**
     * Function for unbinding the drag listener
     */
    private unbindDragListener: Function;

    constructor(protected hostElement: ElementRef, private renderer: Renderer2,
        private dndService: DndService, private zone: NgZone) {
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
                e.dataTransfer.setData('data', JSON.stringify(this.dragData));
            }

            // Set dragImage
            if (this.dragImage) {
                e.dataTransfer.setDragImage(this.dragImageElement, 0, 0);
            }

            e.stopPropagation();
            this.onDragStart.emit(e);
            this.dndService.dragStart$.next();

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
    dragEnd(e: Event) {
        this.unbindDragListeners();
        this.renderer.removeClass(this.hostElement.nativeElement, this.dragClass);
        this.dndService.dragEnd$.next();
        this.onDragEnd.emit(e);
        e.stopPropagation();
        e.preventDefault();
    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    mousedown(e: Event) {
        this.mouseDownElement = e.target;
    }

    private allowDrag() {
        if (this.dragHandleElement) {
            // not testing
            return this.mouseDownElement.isSameNode(this.dragHandleElement.nativeElement) && this.dragEnabled;
        } else {
            return this.dragEnabled;
        }
    }


    unbindDragListeners() {
        if (this.unbindDragListener) {
            this.unbindDragListener();
        }
    }
}
