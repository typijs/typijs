import { Component, Input } from '@angular/core';
import { TreeNode } from '../../shared/tree/interfaces/tree-node';

import { UploadService } from './upload.service';

@Component({
    selector: 'file-drop',
    template: `
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
    @Input() targetFolder: Partial<TreeNode>;

    constructor(private uploadService: UploadService) {
        this.reset();
    }

    filesChange(fileList: FileList) {
        if (!fileList.length) return;
        const chooseFiles = [];
        Array.from(Array(fileList.length).keys())
            .map(index => {
                chooseFiles.push(fileList[index])
            });
        this.uploadService.uploadFiles(chooseFiles, this.targetFolder);
    }

    reset() {
    }
}