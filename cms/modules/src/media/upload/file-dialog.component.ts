import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Subscription } from 'rxjs';
import { TreeNode } from '../../shared/tree/interfaces/tree-node';
import { UploadService, UploadProgress } from './upload.service';

@Component({
    selector: 'file-dialog',
    template: `
    <ng-template #fileDialogTemplate>
        <div class="modal-header">
            <h4 class="modal-title">Upload To {{targeFolder?.name}}</h4>
            <button type="button" class="close pull-right" aria-label="Close" (click)="closeDialog()">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <table class="table table-hover table-sm">
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
        </div>
    </ng-template>
    `
})

export class FileDialogComponent {
    @ViewChild('fileDialogTemplate', { static: true }) fileDialogTemplate: TemplateRef<any>;
    progress: UploadProgress;
    chooseFiles: Array<File>;
    modalRef: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true
      };
    targeFolder: TreeNode;

    private subscriptions: Subscription[] = [];
    constructor(
        private modalService: BsModalService,
        private uploadService: UploadService) {
        this.subscriptions.push(this.uploadService.fileUploadProgress$.subscribe(data => {
            this.progress = data.uploadProgress;
            this.chooseFiles = data.files;
            this.targeFolder = data.folder;
            this.openDialog();
        }));
    }

    openDialog() {
        this.modalRef = this.modalService.show(this.fileDialogTemplate, this.config);
    }

    closeDialog() {
        this.modalRef.hide()
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }
}