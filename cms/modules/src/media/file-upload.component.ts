import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, Input, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";
import { UploadService } from './upload.service';

@Component({
    selector: 'file-upload',
    template: `
        <!--UPLOAD-->
        <form #f="ngForm" enctype="multipart/form-data" novalidate>
            <div class="dropbox">
                <input type="file" multiple [name]="uploadFieldName" title=" " (change)="filesChange($event.target.name, $event.target.files)"/>
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

        .show {
            display: block;
        }
  `]
})

export class FileUploadComponent {

    progress: any;

    chooseFiles: Array<File>;
    uploadError: any;
    currentStatus: number;

    readonly STATUS_INITIAL = 0;
    readonly STATUS_SAVING = 1;
    readonly STATUS_SUCCESS = 2;
    readonly STATUS_FAILED = 3;

    @Input() uploadFieldName: string;
    @Output() onUploadedFile: EventEmitter<any> = new EventEmitter();
    @Output() onFileChange: EventEmitter<any> = new EventEmitter();

    constructor(private ref: ChangeDetectorRef, private uploadService: UploadService) {
        this.uploadFieldName = "files";
        this.reset();
    }

    filesChange(fieldName: string, fileList: FileList) {
        if (!fileList.length) return;

        this.currentStatus = this.STATUS_INITIAL;
        Array.from(Array(fileList.length).keys())
            .map(index => {
                this.chooseFiles.push(fileList[index])
            });
        this.onFileChange.emit(this.chooseFiles);
    }

    reset() {
        this.chooseFiles = [];
        this.currentStatus = this.STATUS_INITIAL;
        this.uploadError = null;
    }

}