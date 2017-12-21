import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SelectElement } from '../select.element';

@Component({
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <checkbox-group [formControlName]="propertyName">
                    <checkbox *ngFor="let selectItem of selectItems;" [value]="selectItem.value">{{selectItem.text}}</checkbox>
                </checkbox-group>
            </div>
        </div>
    `
})
export class CheckboxElement extends SelectElement {
}