import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SelectProperty } from './../select-property';

@Component({
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <select *ngIf="selectItems" class="form-control" [id]="id" [formControlName]="propertyName" [name]="propertyName">
                    <option *ngFor="let selectItem of selectItems" [value]="selectItem.value">{{selectItem.text}}</option>
                </select>
            </div>
        </div>
    `
})
export class DropdownComponent extends SelectProperty {
}