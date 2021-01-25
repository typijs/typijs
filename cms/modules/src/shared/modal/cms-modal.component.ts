import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'cms-modal',
    template: `
    <div class="modal-header">
        <h4 class="modal-title">{{ title }}</h4>
        <button type="button" class="close" aria-label="Close" (click)="bsModalRef.hide()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body {{bodyClass}}">
        <ng-content></ng-content>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn {{okButtonClass}}" [disabled]="disableOkButton" (click)="onOkClick()">{{okButtonText}}</button>
        <button type="button" class="btn {{cancelButtonClass}}" (click)="onCancelClick()">{{cancelButtonText}}</button>
    </div>
  `
})
export class CmsModalComponent {

    @Input() title: string;
    @Input() bodyClass: string;

    @Input() okButtonText: string;
    @Input() disableOkButton: boolean;
    @Input() okButtonClass: string;

    @Input() cancelButtonText: string;
    @Input() cancelButtonClass: string;

    @Output() ok: EventEmitter<void> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    constructor(public bsModalRef: BsModalRef) {
        this.okButtonText = 'OK';
        this.okButtonClass = 'btn-primary'
        this.cancelButtonText = 'Cancel';
        this.cancelButtonClass = 'btn-default';
        this.disableOkButton = false;

    }

    onOkClick() {
        this.ok.emit();
        this.bsModalRef.hide();
    }

    onCancelClick() {
        this.cancel.emit();
        this.bsModalRef.hide();
    }
}
