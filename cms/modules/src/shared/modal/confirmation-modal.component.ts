import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'confirmation-modal',
    template: `
    <cms-modal
        [title]="title"
        [okButtonText]="btnYesText"
        [cancelButtonText]="btnNoText"
        [okButtonClass]="'btn-danger'"
        (ok)="confirm()"
        (cancel)="decline()">
        {{ message }}
    </cms-modal>
  `,
})
export class ConfirmationModalComponent {

    @Input() title: string;
    @Input() message: string;
    @Input() btnYesText: string;
    @Input() btnNoText: string;
    private isConfirm$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(public bsModalRef: BsModalRef) { }

    confirm(): void {
        this.isConfirm$.next(true);
        this.bsModalRef.hide();
    }

    decline(): void {
        this.isConfirm$.next(false);
        this.bsModalRef.hide();
    }

    getResult(): Observable<boolean> {
        return this.isConfirm$.asObservable().pipe(take(1));
    }
}
