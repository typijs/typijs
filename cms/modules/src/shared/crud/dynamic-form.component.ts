import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ChangeDetectorRef, Input, ComponentRef, Output, EventEmitter } from '@angular/core';
import { InsertPointDirective, CmsPropertyFactoryResolver, ContentTypeService, ContentTypeProperty, CmsObject } from '@angular-cms/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'cms-form',
    templateUrl: 'dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(InsertPointDirective, { static: true }) insertPoint: InsertPointDirective;

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
                this.contentFormGroup = this.createFormGroup(this.contentTypeProperties);
            }
        }
    }
    private _formData: any;

    @Output() submit: EventEmitter<CmsObject> = new EventEmitter<CmsObject>();

    contentFormGroup: FormGroup = new FormGroup({});
    private componentRefs: ComponentRef<any>[] = [];
    private contentTypeProperties: ContentTypeProperty[] = [];

    constructor(
        private propertyFactoryResolver: CmsPropertyFactoryResolver,
        private formBuilder: FormBuilder,
        private changeDetectionRef: ChangeDetectorRef,
        private contentTypeService: ContentTypeService
    ) { }

    ngOnInit() {
        // Get property info
        this.contentTypeProperties = this.contentTypeService.getContentTypeProperties(this.modelType);
        this.contentFormGroup = this.createFormGroup(this.contentTypeProperties);
    }

    ngAfterViewInit(): void {
        // Create form
        this.componentRefs = this.createPropertyComponents(this.contentTypeProperties);
        this.changeDetectionRef.detectChanges();
    }

    ngOnDestroy(): void {
        if (this.insertPoint) {
            this.insertPoint.viewContainerRef.clear();
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

    private createFormGroup(properties: ContentTypeProperty[]): FormGroup {
        if (properties) {
            const formModel = this.formData ? this.formData : {};
            const formControls: { [key: string]: any } = {};

            properties.forEach(property => {
                const validators = [];
                if (property.metadata.validates) {
                    property.metadata.validates.forEach(validate => {
                        validators.push(validate.validateFn);
                    });
                }
                formControls[property.name] = [formModel[property.name], validators];
            });
            return this.formBuilder.group(formControls);
        }
        return new FormGroup({});
    }

    private createPropertyComponents(properties: ContentTypeProperty[]): ComponentRef<any>[] {
        const propertyControls: ComponentRef<any>[] = [];

        const viewContainerRef = this.insertPoint.viewContainerRef;
        viewContainerRef.clear();

        properties.forEach(property => {
            try {
                const propertyFactory = this.propertyFactoryResolver.resolvePropertyFactory(property.metadata.displayType);
                const propertyComponent = propertyFactory.createPropertyComponent(property, this.contentFormGroup);
                viewContainerRef.insert(propertyComponent.hostView);
                propertyControls.push(propertyComponent);
            } catch (error) {
                console.error(error);
            }
        });

        return propertyControls;
    }
}
