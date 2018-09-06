import { Directive, Renderer2, HostBinding, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[dragOver]',
})
export class DragOverDirective {
    constructor(private renderer: Renderer2, private hostElement: ElementRef) {}

    @HostListener('dragover', ['$event']) public onDragOver(event) {
        if(!this.containsFiles(event)) return;
        event.preventDefault();
        event.stopPropagation();
        this.renderer.addClass(this.hostElement.nativeElement, 'drag-over');
    }

    private containsFiles(event) {
        if (event.dataTransfer.types) {
            for (var i = 0; i < event.dataTransfer.types.length; i++) {
                if (event.dataTransfer.types[i] == "Files") {
                    return true;
                }
            }
        }
        return false;
    }
}