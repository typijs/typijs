import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SelectProperty } from '../select-property';

@Component({
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <checkbox-group [formControlName]="propertyName" [selectItems] = "selectItems">
                </checkbox-group>
            </div>
        </div>
    `
})
export class CheckboxComponent extends SelectProperty {
}