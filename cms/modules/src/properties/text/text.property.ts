import { Component } from '@angular/core';
import { CmsProperty } from '@angular-cms/core';

@Component({
    selector: '[textProperty]',
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
        <div class="col-5">
            <input type="text" class="form-control"
                    [id]="id"
                    [name]="propertyName"
                    [formControlName]="propertyName"/>
        </div>
    </div>
  `
})
export class TextProperty extends CmsProperty {
}
