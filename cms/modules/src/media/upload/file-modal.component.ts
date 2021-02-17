import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TreeNode } from '../../shared/tree/interfaces/tree-node';
import { UploadProgress, UploadService } from './upload.service';

@Component({
    selector: 'file-modal',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">Upload To {{uploadFolder?.name}}</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div dragOver class="modal-body">
            <div class="mb-3">
                <div class="custom-file col-5">
                    <input type="file" id="modalInputFile" class="custom-file-input" multiple
                        cmsFileSelect
                        (fileSelected)="onUploadFiles($event)"/>
                    <label class="custom-file-label" for="modalInputFile">Choose files</label>
                </div>
                <span class="align-middle"> Or drop files here</span>
            </div>
            <div class="drop-zone" dragLeave>
                <file-drop (filesDropped)="onUploadFiles($event)"></file-drop>
            </div>
            <table *ngIf="files && files.length > 0" class="table table-hover table-sm under-drop-area">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Size (KB)</th>
                        <th scope="col">Progress</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let file of files">
                        <td><div>{{file.name}}</div></td>
                        <td><div>{{file.size/1000}}</div></td>
                        <td>
                            <progressbar
                                *ngIf="uploadProgress"
                                [animate]="true"
                                [value]="uploadProgress[file.name].progress | async">
                                <b>{{uploadProgress[file.name].progress | async}}%</b>
                            </progressbar>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div *ngIf="!files || files.length == 0" class="drop-zone-fake under-drop-area"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Close</button>
        </div>
    `,
    styles: [`

        .drop-zone {
            height: 200px;
            position: relative;
            z-index: 99;
            display: none;
            background-color: #f5f5f5;
            border: dotted 3px lightgray;
        }

        .drop-zone-fake {
            height: 200px;
            position: relative;
            z-index: 99;
            background-color: #f5f5f5;
            border: dotted 3px lightgray;
        }

        .drag-over .under-drop-area{
            display: none;
        }

        .drag-over .drop-zone{
            display: block;
        }
    `]
})

export class FileModalComponent {
    files: File[] = [];
    uploadProgress: UploadProgress = {};
    uploadFolder: Partial<TreeNode>;

    constructor(private uploadService: UploadService, public bsModalRef: BsModalRef) { }

    onUploadFiles(files: File[]) {
        this.uploadService.uploadFiles(files, this.uploadFolder).subscribe(result => {
            this.files = this.files.concat(result.files);
            this.uploadProgress = Object.assign(this.uploadProgress, result.uploadProgress);
        });
    }
}
