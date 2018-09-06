import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UploadService } from './upload.service';

@Component({
    selector: 'file-dialog',
    template: `
    <div class="modal fade" tabindex="-1" role="dialog" [class.show]="showDialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Modal title</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="closeDialog()">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <table class="table table-responsive-sm table-hover table-outline mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th>Name</th>
                                <th>Size</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let file of chooseFiles">
                                <td><div>{{file.name}}</div></td>
                                <td><div>{{file.size}}</div></td>
                                <td>
                                    <progressbar *ngIf="progress" [animate]="false"  [value]="progress[file.name].progress | async"><b>{{progress[file.name].progress | async}}%</b></progressbar>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" (click)="closeDialog()">Close</button>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .show {
            display: block;
        }
  `]
})

export class FileDialogComponent {

    showDialog: boolean;
    progress: any;
    chooseFiles: Array<File>;
    private subscriptions: Subscription[] = [];
    
    constructor(private uploadService: UploadService) {
        this.subscriptions.push(this.uploadService.openFileDialog$.subscribe(data => {
            this.progress = data.uploadProgress;
            this.chooseFiles = data.files;
            this.openDialog();
        }));
    }

    openDialog() {
        this.showDialog = true;
    }

    closeDialog() {
        this.showDialog = false;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }
}