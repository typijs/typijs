import { Component } from '@angular/core';
import { SelectProperty } from '../select-property';

@Component({
    selector: '[dropdownProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
            <div class="col-5">
                <select *ngIf="selectItems$ |async as selectItems" class="form-control" [id]="id" [formControlName]="propertyName" [name]="propertyName">
                    <option *ngFor="let selectItem of selectItems" [value]="selectItem.value">{{selectItem.text}}</option>
                </select>
            </div>
        </div>
    `
})
export class DropdownProperty extends SelectProperty {
}
