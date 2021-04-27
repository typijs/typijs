import { Component, Input } from '@angular/core';

import { CmsProperty } from '@typijs/core';

@Component({
    selector: '[contentReferenceProperty]',
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
        <div class="col-5">
            <content-reference [formControlName]="propertyName" [allowedTypes]="allowedTypes"></content-reference>
        </div>
    </div>
  `
})

export class ContentReferenceProperty extends CmsProperty {
    @Input() allowedTypes: string[];
}
