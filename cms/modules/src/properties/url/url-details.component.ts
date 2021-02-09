import { ClassOf, UrlItem } from '@angular-cms/core';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { DynamicFormComponent } from '../../shared/form/dynamic-form.component';

@Component({
    selector: 'url-details',
    template: `
    <cms-modal
        [title]="title"
        (ok)="formId.submit()">
        <cms-form
            #formId="cmsForm"
            (ngSubmit)="createItem($event)"
            [modelType]="itemType"
            [model]="urlData">
            <div [formGroup]="formId.formGroup">
                <ng-container [ngSwitch]="urlType$ | async">
                    <div *ngSwitchCase="'page'" class="form-group row">
                        <label class="col-3 col-form-label">Page</label>
                        <div class="col-9">
                            <content-reference [formControlName]="'page'"></content-reference>
                        </div>
                        <label class="col-3 mt-3 col-form-label">Remaining Url</label>
                        <div class="col-9 mt-3">
                            <input type="text" class="form-control"
                                [name]="'remainingUrl'"
                                [formControlName]="'remainingUrl'"/>
                        </div>
                    </div>
                    <div *ngSwitchCase="'media'" class="form-group row">
                        <label class="col-3 col-form-label">Media</label>
                        <div class="col-9">
                            <image-reference [formControlName]="'media'"></image-reference>
                        </div>
                        <label class="col-3 mt-3 col-form-label">Remaining Url</label>
                        <div class="col-9 mt-3">
                            <input type="text" class="form-control"
                                [name]="'remainingUrl'"
                                [formControlName]="'remainingUrl'"/>
                        </div>
                    </div>
                    <div *ngSwitchCase="'email'" class="form-group row">
                        <label class="col-3 col-form-label">Email</label>
                        <div class="col-9">
                            <input type="email" class="form-control"
                                [name]="'email'"
                                [formControlName]="'email'"/>
                        </div>

                    </div>
                    <div *ngSwitchCase="'external'" class="form-group row">
                        <label class="col-3 col-form-label">External Url</label>
                        <div class="col-9">
                            <input type="text" class="form-control"
                                [name]="'external'"
                                [formControlName]="'external'"/>
                        </div>
                    </div>
                </ng-container>

            </div>
        </cms-form>
    </cms-modal>
    `
})
export class UrlDetailsComponent implements AfterViewInit {

    @Input() title: string;
    @Input() urlData: UrlItem;
    @Input() itemType: ClassOf<UrlItem> = UrlItem;

    @ViewChild('formId', { static: true }) urlForm: DynamicFormComponent;

    urlType$: Observable<string>;
    private itemSubject: ReplaySubject<UrlItem> = new ReplaySubject(1);

    constructor(public bsModalRef: BsModalRef) { }

    createItem(item: UrlItem) {
        switch (item.urlType) {
            case 'page':
                item.media = null;
                item.email = null;
                item.external = null;
                break;
            case 'media':
                item.page = null;
                item.email = null;
                item.external = null;
                break;
            case 'email':
                item.media = null;
                item.page = null;
                item.external = null;
                item.remainingUrl = null;
                break;
            case 'external':
                item.media = null;
                item.email = null;
                item.page = null;
                item.remainingUrl = null;
                break;
        }
        this.itemSubject.next(Object.assign(this.urlData, item));
        this.bsModalRef.hide();
    }

    getResult(): Observable<UrlItem> {
        return this.itemSubject.asObservable().pipe(take(1));
    }

    ngAfterViewInit(): void {
        this.urlType$ = this.urlForm.formGroup.get('urlType').valueChanges.pipe(startWith(this.urlData.urlType))
    }

}
