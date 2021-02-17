import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';

@Directive({ selector: '[cmsFileSelect]' })
export class FileSelectDirective {
    @Output() fileSelected: EventEmitter<File[]> = new EventEmitter<File[]>();

    constructor(private element: ElementRef) { }

    private isEmptyAfterSelection(): boolean {
        return !!this.element.nativeElement.attributes.multiple;
    }

    @HostListener('change')
    onChange(): any {
        const files: File[] = this.element.nativeElement.files;
        if (!files.length) { return; }

        const chooseFiles = [];
        Array.from(Array(files.length).keys())
            .map(index => {
                chooseFiles.push(files[index]);
            });

        this.fileSelected.emit(chooseFiles);

        if (this.isEmptyAfterSelection()) {
            this.element.nativeElement.value = '';
        }
    }
}
