import { CmsObject, ContentTypeService, InsertPointDirective } from '@angular-cms/core';
import { Component, ComponentRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { DynamicFormService } from './dynamic-form.service';

@Component({
    selector: 'cms-form',
    exportAs: 'cmsForm',
    templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild(InsertPointDirective, { static: true, read: ViewContainerRef }) formContainerRef: ViewContainerRef;
    @ViewChild('cmsForm', { static: true }) cmsForm: NgForm;

    @Input() modelType: new () => any;

    @Input()
    get formData(): CmsObject {
        return this._formData;
    }
    set formData(value: CmsObject) {
        this._formData = value;
        if (this._formData && this.contentFormGroup) {
            this.contentFormGroup.patchValue(this._formData);
        }
    }
    private _formData: CmsObject;

    @Output() ngSubmit: EventEmitter<CmsObject> = new EventEmitter<CmsObject>();

    contentFormGroup: FormGroup;
    private componentRefs: ComponentRef<any>[];

    constructor(
        private contentTypeService: ContentTypeService,
        private dynamicFormService: DynamicFormService
    ) { }

    ngOnChanges({ modelType, formData }: SimpleChanges): void {
        // handle the second change of modelType to render the form
        if (!modelType.isFirstChange()) {
            this.createDynamicForm(modelType.currentValue, formData.currentValue);
        }
    }

    ngOnInit() {
        // handle in first change of all inputs
        this.createDynamicForm(this.modelType, this.formData);
    }

    onSubmit(formValue: any): void {
        const submittedValue = Object.assign(this._formData, formValue);
        this.ngSubmit.emit(submittedValue);
    }

    submit(): void {
        this.cmsForm.ngSubmit.emit();
    }

    ngOnDestroy(): void {
        if (this.formContainerRef) {
            this.formContainerRef.clear();
        }

        if (this.componentRefs) {
            this.componentRefs.forEach(cmpRef => { cmpRef.destroy(); });
            this.componentRefs = [];
        }
    }

    private createDynamicForm(modelType: new () => any, formData: CmsObject) {
        const contentTypeProperties = this.modelType ? this.contentTypeService.getContentTypeProperties(modelType) : [];
        this.contentFormGroup = this.dynamicFormService.createFormGroup(contentTypeProperties, formData);

        this.componentRefs = this.dynamicFormService.createFormFieldComponents(contentTypeProperties, this.contentFormGroup);
        this.formContainerRef.clear();
        this.componentRefs.forEach(component => this.formContainerRef.insert(component.hostView));
    }
}
