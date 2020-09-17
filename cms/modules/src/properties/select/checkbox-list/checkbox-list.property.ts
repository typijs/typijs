import { Component } from '@angular/core';
import { SelectProperty } from '../select-property';

@Component({
    selector: '[checkboxListProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label class="col-3 col-form-label">{{label}}</label>
            <div class="col-5">
                <checkbox-list [formControlName]="propertyName" [selectItems] = "selectItems$ |async">
                </checkbox-list>
            </div>
        </div>
    `
})
export class CheckboxListProperty extends SelectProperty {
}
