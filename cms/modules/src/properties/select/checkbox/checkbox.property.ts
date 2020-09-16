import { Component } from '@angular/core';
import { SelectProperty } from '../select-property';

@Component({
    selector: '[checkboxProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label class="col-3 col-form-label">{{label}}</label>
            <div class="col-5">
                <checkbox-group [formControlName]="propertyName" [selectItems] = "selectItems$ |async">
                </checkbox-group>
            </div>
        </div>
    `
})
export class CheckboxProperty extends SelectProperty {
}
