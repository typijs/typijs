import 'reflect-metadata';
import { Component, ComponentFactoryResolver, Inject, Injector, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CMS, CmsProperty, InsertPointDirective, ISelectionFactory, PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY, UIHint } from '@angular-cms/core';
import { SelectProperty } from '../select/select-property';
import { ObjectListControl } from './object-list.control';

@Component({
    selector: '[objectListProperty]',
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
        <div class="col-5">
            <div class="card">
                <div class="card-body">
                    <object-list [formControlName]="propertyName"></object-list>
                    
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

export class ObjectListProperty extends CmsProperty {
    @ViewChild(InsertPointDirective, { static: true }) modelEditHost: InsertPointDirective;
    @ViewChild(ObjectListControl, { static: false }) propertyGroup: ObjectListControl;

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
    private _itemType: any;

    showDialog: boolean = false;
    modelForm: FormGroup = new FormGroup({});

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
                if (property.metadata.displayType == UIHint.ObjectList) {
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
                } else if (propertyComponent.instance instanceof ObjectListProperty) {
                    (<ObjectListProperty>propertyComponent.instance).itemType = property.metadata.objectListItemType;
                }
            });
        }
    }

    onSubmit() {
        this.propertyGroup.addItem(this.modelForm.value);
        this.closeDialog();
    }
}