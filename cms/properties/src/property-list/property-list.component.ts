import { Component, Input, ViewChild, Inject, ComponentFactoryResolver, Injector } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CMS, CmsProperty, UIHint, PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY, InsertPointDirective, ISelectionFactory } from '@angular-cms/core';

import 'reflect-metadata';
import { PropertyListControl } from './property-list.control';
import { SelectProperty } from '../select/select-property';

@Component({
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
        <div class="col-sm-8">
            <div class="card">
                <div class="card-body">
                    <property-group [formControlName]="propertyName"></property-group>
                    
                    <a href="javascript:void(0)" class="btn btn-default btn-block" (click)="openDiglog()">Add item</a>
                </div>
            </div>
        </div>
        <div class="modal fade" tabindex="-1" role="dialog" [class.show]="showDialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Modal title</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="closeDialog()">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form (ngSubmit)="onSubmit()" [formGroup]="modelForm">
                            <ng-template cmsInsertPoint></ng-template>
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
        .show {
            display: block;
        }
    `]
})

export class PropertyListComponent extends CmsProperty {
    showDialog: boolean = false;
    modelForm: FormGroup = new FormGroup({});
    private _itemType: any;

    @ViewChild(InsertPointDirective, { static: false }) modelEditHost: InsertPointDirective;
    @ViewChild(PropertyListControl, { static: false }) propertyGroup: PropertyListControl;

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
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector) {
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
                let validators = [];
                if (property.metadata.validates) {
                    property.metadata.validates.forEach(validate => {
                        validators.push(validate.validateFn);
                    })
                }
                if (property.metadata.displayType == UIHint.PropertyList) {
                    group[property.name] = [[], validators]
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
                let propertyFactory = this.componentFactoryResolver.resolveComponentFactory(CMS.PROPERTIES[property.metadata.displayType]);
                let propertyComponent = viewContainerRef.createComponent(propertyFactory);
                (<CmsProperty>propertyComponent.instance).label = property.metadata.displayName;
                (<CmsProperty>propertyComponent.instance).formGroup = this.modelForm;
                (<CmsProperty>propertyComponent.instance).propertyName = property.name;

                if (propertyComponent.instance instanceof SelectProperty) {
                    (<SelectProperty>propertyComponent.instance).selectItems = (<ISelectionFactory>(this.injector.get(property.metadata.selectionFactory))).GetSelections();
                } else if (propertyComponent.instance instanceof PropertyListComponent) {
                    (<PropertyListComponent>propertyComponent.instance).itemType = property.metadata.propertyListItemType;
                }
            });
        }
    }

    onSubmit() {
        this.propertyGroup.addItem(this.modelForm.value);
        this.closeDialog();
    }
}