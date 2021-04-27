import { Component, ComponentRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ClassOf, CmsObject, ContentTypeService, InsertPointDirective } from '@typijs/core';
import { DynamicFormService } from './dynamic-form.service';

@Component({
    selector: 'cms-form',
    exportAs: 'cmsForm',
    template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit(ngForm.value)" #ngForm="ngForm">
        <div>
            <ng-template cmsInsertPoint></ng-template>
            <ng-content></ng-content>
        </div>
        <!-- <input type="submit" value="Submit"/> -->
    </form>
    `,
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild(InsertPointDirective, { static: true, read: ViewContainerRef }) formContainerRef: ViewContainerRef;
    @ViewChild('ngForm', { static: true }) ngForm: NgForm;

    /**
     * Form Model Type
     */
    @Input() modelType: ClassOf<any>;

    /**
     * Form Model Data
     */
    @Input()
    get model(): CmsObject {
        return this._model;
    }
    set model(value: CmsObject) {
        this._model = value;
        if (this._model && this.formGroup) {
            this.formGroup.patchValue(this._model);
        }
    }
    private _model: CmsObject;

    @Output() ngSubmit: EventEmitter<CmsObject> = new EventEmitter<CmsObject>();

    formGroup: FormGroup;
    private componentRefs: ComponentRef<any>[];

    constructor(
        private contentTypeService: ContentTypeService,
        private dynamicFormService: DynamicFormService
    ) { }

    ngOnChanges({ modelType, model }: SimpleChanges): void {
        // handle the second change of modelType to render the form
        if (modelType && !modelType.isFirstChange()) {
            this.createDynamicForm(modelType.currentValue, model.currentValue);
        }
    }

    ngOnInit() {
        // handle in first change of all inputs
        this.createDynamicForm(this.modelType, this.model);
    }

    onSubmit(formValue: any): void {
        const submittedValue = Object.assign(this._model, formValue);
        this.ngSubmit.emit(submittedValue);
    }

    submit(): void {
        this.ngForm.ngSubmit.emit();
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

    private createDynamicForm(modelType: ClassOf<any>, model: CmsObject) {
        const contentTypeProperties = this.modelType ? this.contentTypeService.getContentTypeProperties(modelType) : [];
        this.formGroup = this.dynamicFormService.createFormGroup(contentTypeProperties, model);

        this.componentRefs = this.dynamicFormService.createFormFieldComponents(contentTypeProperties, this.formGroup);
        this.formContainerRef.clear();
        this.componentRefs.forEach(component => this.formContainerRef.insert(component.hostView));
    }
}
