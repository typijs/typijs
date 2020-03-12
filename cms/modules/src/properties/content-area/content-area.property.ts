import { Component, Input } from '@angular/core';

import { CmsProperty } from '@angular-cms/core';

@Component({
    selector: '[contentAreaProperty]',
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-4 col-form-label">{{label}}</label>
        <div class="col-6">
            <content-area [formControlName]="propertyName" [name]="propertyName" [allowedTypes]="allowedTypes"></content-area>
        </div>
    </div>
  `
})

export class ContentAreaProperty extends CmsProperty {
    @Input() allowedTypes: string[];
}