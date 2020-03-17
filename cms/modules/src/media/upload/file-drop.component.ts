import { Component, Input } from '@angular/core';
import { TreeNode } from '../../shared/tree';

import { UploadService } from './upload.service';

@Component({
    selector: 'file-drop',
    template: `
        <form #f="ngForm" enctype="multipart/form-data" novalidate>
            <div class="dropbox">
                <input type="file"  
                    multiple 
                    cmsFileSelect
                    [name]="uploadFieldName"
                    (onFileSelected)="filesSelected($event)"/>
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
    }

    filesSelected(files: File[]) {
        this.uploadService.uploadFiles(files, this.targetFolder);
    }
}