import { Component, Input, ChangeDetectionStrategy, ViewChild, Inject, ComponentFactoryResolver, Injector } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

import { CmsProperty, UIHint, PROPERTIES_METADATA_KEY, PROPERTY_METADATA_KEY, InsertPointDirective, BlockService, ISelectionFactory } from '@angular-cms/core';

import { SelectProperty } from '../select/select-property';
import { ContentGroupComponent } from './content-group.component';

@Component({
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
        <div class="col-sm-8">
            <div class="card">
                <div class="card-body">
                    <content-group [formControlName]="propertyName"></content-group>
                    
                    <a href="javascript:void(0)" class="btn btn-default btn-block" (click)="openDiglog()">Add item</a>
                </div>
            </div>
        </div>
        <div class="modal fade" tabindex="-1" role="dialog" [class.show]="showDialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="myModalLabel">Modal title</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="closeDialog()">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group">
                            <li *ngFor="let item of contents;" class="list-group-item d-flex list-group-item-action justify-content-between align-items-center">
                                <div>
                                    <i class="fa fa-comment fa-fw"></i> {{item.name}}
                                </div>
                            </li>
                        </ul>
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

export class ContentAreaComponent extends CmsProperty {
    showDialog: boolean = false;
    modelForm: FormGroup = new FormGroup({});

    contents: Array<any> = [];

    @ViewChild(ContentGroupComponent) contentGroup: ContentGroupComponent;

    constructor(
        private formBuilder: FormBuilder,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private blockService: BlockService) {
        super();
    }

    ngOnInit() {
        this.blockService.getBlockContents().subscribe(res => {
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
        this.contents.forEach(item => {
            this.contentGroup.addItem(item);
        })
        this.closeDialog();
    }
}