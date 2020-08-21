import { Component, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs/operators';

import { ModalComponent } from '../../shared/modal.component';
import { TreeNode } from '../../shared/tree/interfaces/tree-node';
import { UploadProgress, UploadService } from './upload.service';

@Component({
    selector: 'file-modal',
    template: `
    <ng-template #modalTemplate>
        <div class="modal-header">
            <h4 class="modal-title">Upload To {{targetFolder?.name}}</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="hideModal()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div dragOver class="modal-body">
            <div class="mb-3">
                <div class="custom-file col-5">
                    <input type="file" id="modalInputFile" class="custom-file-input" multiple
                        cmsFileSelect
                        (fileSelected)="filesSelected($event)"/>
                    <label class="custom-file-label" for="modalInputFile">Choose files</label>
                </div>
                <span class="align-middle"> Or drop files here</span>
            </div>
            <div class="drop-zone" dragLeave>
                <file-drop [uploadFieldName]='"files"' [targetFolder]="targetFolder"></file-drop>
            </div>
            <table *ngIf="chooseFiles && chooseFiles.length > 0" class="table table-hover table-sm under-drop-area">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Size (KB)</th>
                        <th scope="col">Progress</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let file of chooseFiles">
                        <td><div>{{file.name}}</div></td>
                        <td><div>{{file.size/1000}}</div></td>
                        <td>
                            <progressbar
                                *ngIf="progress"
                                [animate]="true"
                                [value]="progress[file.name].progress | async">
                                <b>{{progress[file.name].progress | async}}%</b>
                            </progressbar>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div *ngIf="!chooseFiles || chooseFiles.length == 0" class="drop-zone-fake under-drop-area"></div>
        </div>
    </ng-template>
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

export class FileModalComponent extends ModalComponent {
    @Input() targetFolder: Partial<TreeNode>;
    progress: UploadProgress;
    chooseFiles: File[];

    constructor(modalService: BsModalService, private uploadService: UploadService) {
        super(modalService);
        this.config = {
            ignoreBackdropClick: true
        };
        this.uploadService.fileUploadProgress$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.targetFolder = data.folder;
                this.progress = data.uploadProgress;
                this.chooseFiles = data.files;
                if (!this.isModalShown) { this.showModal(); }
            });
    }

    filesSelected(files: File[]) {
        this.uploadService.uploadFiles(files, this.targetFolder);
    }

    openFileUploadModal(folder: Partial<TreeNode>) {
        this.targetFolder = folder;
        this.progress = {};
        this.chooseFiles = [];
        this.showModal();
    }
}
