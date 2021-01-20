import { CmsObject, ContentTypeProperty, ContentTypeService, InsertPointDirective } from '@angular-cms/core';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService } from '../services/dynamic-form.service';

@Component({
    selector: 'cms-form',
    templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(InsertPointDirective, { static: true, read: ViewContainerRef }) formContainerRef: ViewContainerRef;

    @Input() modelType: new () => any;
    @Input()
    get formData(): any {
        return this._formData;
    }
    set formData(value: any) {
        this._formData = value;
        if (this._formData) {
            if (this.contentFormGroup) {
                this.contentFormGroup.patchValue(this._formData);
            } else {
                this.contentFormGroup = this.dynamicFormService.createFormGroup(this.contentTypeProperties, this._formData);
            }
        }
    }
    private _formData: any;

    @Output() submit: EventEmitter<CmsObject> = new EventEmitter<CmsObject>();

    contentFormGroup: FormGroup = new FormGroup({});
    private componentRefs: ComponentRef<any>[] = [];
    private contentTypeProperties: ContentTypeProperty[] = [];

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private contentTypeService: ContentTypeService,
        private dynamicFormService: DynamicFormService
    ) { }

    ngOnInit() {
        // Get property info
        this.contentTypeProperties = this.contentTypeService.getContentTypeProperties(this.modelType);
        this.contentFormGroup = this.dynamicFormService.createFormGroup(this.contentTypeProperties, this.formData);
    }

    ngAfterViewInit(): void {
        // Create form
        this.componentRefs = this.dynamicFormService.createFormFieldComponents(this.contentTypeProperties, this.contentFormGroup);
        this.formContainerRef.clear();
        this.componentRefs.forEach(component => this.formContainerRef.insert(component.hostView));
        this.changeDetectionRef.detectChanges();
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

    onSubmit(formValue: any): void {
        const submittedValue = Object.assign(this._formData, formValue);
        this.submit.emit(submittedValue);
    }
}
