import { Directive, EventEmitter, ElementRef, Input, HostListener, Output } from '@angular/core';

@Directive({ selector: '[cmsFileSelect]' })
export class FileSelectDirective {
    @Output() public onFileSelected: EventEmitter<File[]> = new EventEmitter<File[]>();

    public constructor(private element: ElementRef) {}

    private isEmptyAfterSelection(): boolean {
        return !!this.element.nativeElement.attributes.multiple;
    }

    @HostListener('change')
    public onChange(): any {
        const files: File[] = this.element.nativeElement.files;
        if (!files.length) return;

        const chooseFiles = [];
        Array.from(Array(files.length).keys())
            .map(index => {
                chooseFiles.push(files[index])
            });
        
        this.onFileSelected.emit(chooseFiles);

        if (this.isEmptyAfterSelection()) {
            this.element.nativeElement.value = '';
        }
    }
}