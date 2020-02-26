import { Component, Output, Input, EventEmitter } from '@angular/core';
import { UploadService } from './upload.service';

@Component({
    selector: 'file-drop',
    template: `
        <!--UPLOAD-->
        <form #f="ngForm" enctype="multipart/form-data" novalidate>
            <div class="dropbox">
                <input type="file"  multiple [name]="uploadFieldName" title=" " (change)="filesChange($event.target.files)"/>
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

    @Input() uploadFieldName: string = "files"; //default field file name
    @Output() onUploadedFile: EventEmitter<any> = new EventEmitter();

    constructor(private uploadService: UploadService) {
        this.reset();
    }

    filesChange(fileList: FileList) {
        if (!fileList.length) return;
        let chooseFiles = [];
        Array.from(Array(fileList.length).keys())
            .map(index => {
                chooseFiles.push(fileList[index])
            });
        this.uploadService.setFilesToUpload(chooseFiles);
    }

    reset() {
    }
}