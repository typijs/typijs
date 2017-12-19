import { Component, Input, ChangeDetectionStrategy, ViewChild, Inject, ComponentFactoryResolver } from '@angular/core';
import { BaseElement } from './../base.element';
import { InsertPointDirective } from './../../../core/directives';
import { Elements } from '../index';
import { PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY } from '../../constants';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UIType } from '../../index';

@Component({
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
        <div class="col-sm-8">
            <div class="panel panel-default">
                <div class="panel-body">
                    <property-items [formGroup]="formGroup" [propertyName]="propertyName"></property-items>
                    
                    <a href="javascript:void(0)" class="btn btn-default btn-block" (click)="openDiglog()">Add item</a>
                </div>
            </div>
        </div>
        <div class="modal fade in" tabindex="-1" role="dialog" [class.show]="showDialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" (click)="closeDialog()">×</button>
                        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
                    </div>
                    <div class="modal-body">
                        <form (ngSubmit)="onSubmit()" [formGroup]="modelForm">
                            <ng-template insert-point></ng-template>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" (click)="closeDialog()">Close</button>
                        <button type="button" class="btn btn-primary" (click)="onSubmit()">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
        modal.show {
            display: block;
        }
    `]
})

export class PropertyListComponent extends BaseElement {
    showDialog: boolean = false;
    modelForm: FormGroup = new FormGroup({});
    private _itemType: any;

    @ViewChild(InsertPointDirective) modelEditHost: InsertPointDirective;

    @Input()
    set itemType(itemType: any) {
        this._itemType = itemType;
        let properties = Reflect.getMetadata(PROPERTIES_METADATA_KEY, this._itemType);
        let propertiesMetadata = [];
        if (properties)
            properties.forEach(element => {
                propertiesMetadata.push({
                    name: element,
                    metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, this._itemType, element)
                })
            });

        if (propertiesMetadata.length > 0) {
            this.createModelFormGroup(propertiesMetadata);
            this.createModelFormControls(propertiesMetadata);
        }
    }
    get itemType(): any {
        return this._itemType;
    }

    constructor(
        private formBuilder: FormBuilder,
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver) {
        super();
    }

    openDiglog() {
        this.showDialog = true;
    }

    closeDialog() {
        this.showDialog = false;
    }

    private createModelFormGroup(properties) {
        if (properties) {
            let group = {};
            properties.forEach(property => {
                console.log('Model form ', property);
                let validators = [];
                if (property.metadata.validates) {
                    property.metadata.validates.forEach(validate => {
                        validators.push(validate.validateFn);
                    })
                }
                if (property.metadata.displayType == UIType.PropertyList) {
                    group[property.name] = this.formBuilder.array([])
                } else {
                    group[property.name] = ['', validators]
                }
            });
            this.modelForm = this.formBuilder.group(group)
        }
    }

    private createModelFormControls(properties) {
        if (properties) {
            let viewContainerRef = this.modelEditHost.viewContainerRef;
            viewContainerRef.clear();

            properties.forEach(property => {
                let propertyFactory = this.componentFactoryResolver.resolveComponentFactory(Elements[property.metadata.displayType]);
                let propertyComponent = viewContainerRef.createComponent(propertyFactory);
                (<BaseElement>propertyComponent.instance).label = property.metadata.displayName;
                (<BaseElement>propertyComponent.instance).formGroup = this.modelForm;
                (<BaseElement>propertyComponent.instance).propertyName = property.name;
            });
        }
    }

    onSubmit() {
        console.log(this.modelForm.value);
        console.log(this.modelForm.valid);
        const controls = <FormArray>this.formGroup['controls'][this.propertyName];
        let group = {};
        Object.keys(this.modelForm.value).forEach(key => {
            group[key] = [this.modelForm.value[key]]
        })
        controls.push(this.formBuilder.group(group));
        this.closeDialog();
    }
}