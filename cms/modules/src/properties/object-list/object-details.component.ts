import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'object-details',
    template: `
    <cms-modal
        [title]="title"
        [disableOkButton]="!formId.ngForm.valid"
        (ok)="formId.submit()">
        <cms-form
            #formId="cmsForm"
            (ngSubmit)="createItem($event)"
            [modelType]="itemType"
            [model]="itemData">
        </cms-form>
    </cms-modal>
    `
})
export class ObjectDetailsComponent {

    @Input() title: string;
    @Input() itemData: { [key: string]: any };
    @Input() itemType: new () => any;

    private itemSubject: ReplaySubject<{ [key: string]: any }> = new ReplaySubject(1);

    constructor(public bsModalRef: BsModalRef) { }

    createItem(item: { [key: string]: any }) {
        this.itemSubject.next(Object.assign(this.itemData, item));
        this.bsModalRef.hide();
    }

    getResult(): Observable<{ [key: string]: any }> {
        return this.itemSubject.asObservable().pipe(take(1));
    }
}
