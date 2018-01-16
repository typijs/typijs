import { Component, Input, ChangeDetectionStrategy, ViewChild, Inject, ComponentFactoryResolver, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { CmsProperty, UIType, PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY, InsertPointDirective, ContentService, ISelectionFactory } from '@angular-cms/core';

import { SelectProperty } from '../select/select-property';
import { ContentGroupComponent } from './content-group.component';

@Component({
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
        <div class="col-sm-8">
            <div class="panel panel-default">
                <div class="panel-body">
                    <content-group [formControlName]="propertyName"></content-group>
                    
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
                        <div class="list-group">
                            <div *ngFor="let item of contents;">
                                <a href="javascript:void(0)" class="list-group-item">
                                    <i class="fa fa-comment fa-fw"></i> {{item.name}}
                                </a>
                            </div>
                        </div>
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

export class ContentAreaComponent extends CmsProperty {
    showDialog: boolean = false;
    modelForm: FormGroup = new FormGroup({});

    contents: Array<any> = [];

    @ViewChild(ContentGroupComponent) contentGroup: ContentGroupComponent;

    constructor(
        private formBuilder: FormBuilder,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private contentService: ContentService) {
        super();
    }

    ngOnInit() {
        this.contentService.getBlockContents().subscribe(res => {
            this.contents = res;
        })
    }

    openDiglog() {
        this.showDialog = true;
    }

    closeDialog() {
        this.showDialog = false;
    }

    onSubmit() {
        this.contents.forEach(item=> {
            this.contentGroup.addItem(item);
        })
        this.closeDialog();
    }
}