import { Directive, ElementRef, Renderer2, Host } from '@angular/core';
import { Droppable } from './droppable.directive';

@Directive({ selector: '[dndPlaceholder]' })
export class DndPlaceholder {
    constructor(@Host() dropable: Droppable, private renderer: Renderer2, private hostElement: ElementRef) {
        this.renderer.addClass(this.hostElement.nativeElement, 'dndPlaceholder');
        this.hostElement.nativeElement.remove();
        dropable.setDndPlaceholder(this.hostElement);
    }
}