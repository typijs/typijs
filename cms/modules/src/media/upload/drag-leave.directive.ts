import { Directive, Renderer2, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[dragLeave]',
})
export class DragLeaveDirective {
    constructor(private renderer: Renderer2, private hostElement: ElementRef) { }

    @HostListener('dragleave', ['$event']) public onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.renderer.removeClass(this.hostElement.nativeElement.parentNode, 'drag-over');
    }

    @HostListener('drop', ['$event']) public onDrop() {
        //evt.preventDefault();
        //evt.stopPropagation();
        this.renderer.removeClass(this.hostElement.nativeElement.parentNode, 'drag-over');
    }
}