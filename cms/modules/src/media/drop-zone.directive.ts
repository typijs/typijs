import { Input, Directive, Renderer2, Inject, HostBinding, HostListener, ViewChild, ElementRef } from '@angular/core';

@Directive({
    selector: '[dropZone]',
})
export class DropZoneDirective {
    @Input('dropZone') name: string;
    constructor(private renderer: Renderer2, private hostElement: ElementRef) { 

    }
    @HostBinding('style.background') private background = '#eee';

    @HostListener('dragover', ['$event']) public onDragOver(event) {
        event.preventDefault();
        //event.stopPropagation();
        this.background = '#999';
        //console.log("dragover");
        this.renderer.addClass(this.hostElement.nativeElement, 'drag-over');
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(event) {
        event.preventDefault();
        //event.stopPropagation();
        this.background = '#eee';
        this.renderer.removeClass(this.hostElement.nativeElement, 'drag-over');
        console.log("dragleave");
    }

    @HostListener('drop', ['$event']) public onDrop(evt){
        //evt.preventDefault();
        //evt.stopPropagation();
        this.renderer.removeClass(this.hostElement.nativeElement, 'drag-over');
    }
}