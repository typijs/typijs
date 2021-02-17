import { CmsProperty } from '@angular-cms/core';
import { Component } from '@angular/core';

@Component({
    selector: '[checkboxProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <div class="col-3"></div>
            <div class="col-5">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input"
                            [id]="id"
                            [name]="propertyName"
                            [formControlName]="propertyName"/>
                    <label class="form-check-label" [for]="id">{{label}}</label>
                </div>
            </div>
        </div>
    `
})
export class CheckboxProperty extends CmsProperty { }
