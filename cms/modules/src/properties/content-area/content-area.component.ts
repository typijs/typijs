import { Component } from '@angular/core';

import { CmsProperty } from '@angular-cms/core';

@Component({
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
        <div class="col-sm-8">
            <div class="card">
                <div class="card-body" >
                    <content-area [formControlName]="propertyName" [name]="propertyName"></content-area>
                </div>
            </div>
        </div>
    </div>
  `
})

export class ContentAreaComponent extends CmsProperty {}