import { Directive, ElementRef, Renderer2, Host } from '@angular/core';
import { Droppable } from './droppable.directive';

@Directive({ selector: '[dragPlaceholder]' })
export class DragPlaceholder {
    constructor(@Host() droppable: Droppable, private renderer: Renderer2, private hostElement: ElementRef) {
        this.renderer.addClass(this.hostElement.nativeElement, 'drag-placeholder');
        this.hostElement.nativeElement.remove();
        droppable.setDragPlaceholder(this.hostElement);
    }
}