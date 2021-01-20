import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'content-dialog',
    template: `
    <div class="modal-header">
        <h4 class="modal-title">{{ title }}</h4>
        <button type="button" class="close" aria-label="Close" (click)="bsModalRef.hide()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body overflow-auto p-0">
        <ng-content></ng-content>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-primary" [disabled]="disableSelectButton" (click)="onConfirmSelect()">Select</button>
        <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Cancel</button>
    </div>
  `,
    styles: [`
        .modal-body {
            height: 450px;
        }
  `]
})
export class ContentDialogComponent {

    @Input() title: string;
    @Input() disableSelectButton: boolean = false;
    @Output() confirmSelect: EventEmitter<void> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    constructor(public bsModalRef: BsModalRef) { }

    onConfirmSelect() {
        this.confirmSelect.emit();
        this.bsModalRef.hide();
    }

    onCancel() {
        this.cancel.emit();
        this.bsModalRef.hide();
    }
}
