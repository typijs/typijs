import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'confirmation-dialog',
    template: `
    <div class="modal-header">
        <h4 class="modal-title">{{ title }}</h4>
        <button type="button" class="close" aria-label="Close" (click)="decline()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        {{ message }}
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-danger" (click)="confirm()">{{ btnYesText }}</button>
        <button type="button" class="btn btn-primary" (click)="decline()">{{ btnNoText }}</button>
    </div>
  `,
})
export class ConfirmationDialogComponent {

    @Input() title: string;
    @Input() message: string;
    @Input() btnYesText: string = 'Yes';
    @Input() btnNoText: string = 'No';
    private isConfirm: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public bsModalRef: BsModalRef) { }

    confirm(): void {
        this.isConfirm.next(true);
        this.bsModalRef.hide();
    }

    decline(): void {
        this.isConfirm.next(false);
        this.bsModalRef.hide();
    }

    getResult(): Observable<boolean> {
        return this.isConfirm.asObservable().pipe(take(1));
    }
}
