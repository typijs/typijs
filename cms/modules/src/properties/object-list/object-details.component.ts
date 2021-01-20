import { ContentTypeService, InsertPointDirective } from '@angular-cms/core';
import { Component, ComponentRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DynamicFormService } from '../../shared/services/dynamic-form.service';

@Component({
    selector: 'object-details',
    template: `
    <div class="modal-header">
        <h4 class="modal-title">Item Details</h4>
        <button type="button" class="close" aria-label="Close" (click)="bsModalRef.hide()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <form (ngSubmit)="createItem(formId.value)" [formGroup]="itemDetailsForm" #formId="ngForm">
            <ng-template cmsInsertPoint></ng-template>
        </form>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-primary"
            [disabled]="!formId.valid"
            (click)="formId.ngSubmit.emit()">Ok</button>
        <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">Cancel</button>
    </div>
    `
})
export class ObjectDetailsComponent implements OnInit, OnDestroy {
    @ViewChild(InsertPointDirective, { static: true, read: ViewContainerRef }) formContainerRef: ViewContainerRef;

    @Input() itemData: { [key: string]: any };
    @Input() itemType: new () => any;

    itemDetailsForm: FormGroup = new FormGroup({});
    private componentRefs: ComponentRef<any>[] = [];
    private itemSubject: ReplaySubject<{ [key: string]: any }> = new ReplaySubject(1);

    constructor(
        public bsModalRef: BsModalRef,
        private contentTypeService: ContentTypeService,
        private dynamicFormService: DynamicFormService) { }

    ngOnInit() {
        const propertiesMetadata = this.contentTypeService.getContentTypeProperties(this.itemType);
        if (propertiesMetadata.length > 0) {
            this.itemDetailsForm = this.dynamicFormService.createFormGroup(propertiesMetadata, this.itemData);
            this.componentRefs = this.dynamicFormService.createFormFieldComponents(propertiesMetadata, this.itemDetailsForm);

            this.formContainerRef.clear();
            this.componentRefs.forEach(component => this.formContainerRef.insert(component.hostView));
        }
    }

    createItem(item: { [key: string]: any }) {
        this.itemSubject.next(Object.assign(this.itemData, item));
        this.bsModalRef.hide();
    }

    getResult(): Observable<{ [key: string]: any }> {
        return this.itemSubject.asObservable().pipe(take(1));
    }

    ngOnDestroy(): void {
        this.formContainerRef.clear();
        if (this.componentRefs) {
            this.componentRefs.forEach(cmpRef => { cmpRef.destroy(); });
            this.componentRefs = [];
        }
    }
}
