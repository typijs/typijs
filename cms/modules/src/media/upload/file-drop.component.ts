import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'file-drop',
    template: `
        <form #f="ngForm" enctype="multipart/form-data" novalidate>
            <div class="dropbox">
                <input type="file"
                    multiple
                    cmsFileSelect
                    [name]="'files'"
                    (fileSelected)="filesDropped.emit($event)"/>
            </div>
        </form>
    `,
    styles: [`
        input[type="file"] {
            opacity: 0; /* invisible but it's there! */
            width: 100%;
            height: 100%;
            cursor: pointer;
            position: absolute;
            top:0px;
        }
  `]
})
export class FileDropComponent {
    @Output() filesDropped: EventEmitter<File[]> = new EventEmitter<File[]>();
}
