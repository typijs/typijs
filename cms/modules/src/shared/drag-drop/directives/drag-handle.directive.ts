import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({ selector: '[dragHandle]' })
export class DragHandle {
    @Input('dragHandle')
    get dragHandleClasses(): string {
        return this._dragHandleClasses ? this._dragHandleClasses : 'drag-handle';
    }
    set dragHandleClasses(value: string) {
        this._dragHandleClasses = value;
        this.renderer.addClass(this.hostElement.nativeElement, this.dragHandleClasses);
    }
    private _dragHandleClasses: string;

    constructor(private renderer: Renderer2, private hostElement: ElementRef) {
        this.renderer.addClass(this.hostElement.nativeElement, this.dragHandleClasses);
    }
}
