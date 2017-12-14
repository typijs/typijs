import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseElement } from './../base.element';
import { SelectItem } from './select-item';

@Component({
    template: `
        <div class="form-group row">
            <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <select *ngIf="selectItems" class="form-control" [id]="id" [(ngModel)]="model[propertyName]" [name]="propertyName">
                    <option *ngFor="let selectItem of selectItems" [value]="selectItem.value">{{selectItem.text}}</option>
                </select>
            </div>
        </div>
    `
})
export class SelectComponent extends BaseElement {
    @Input() selectItems: SelectItem[];
}