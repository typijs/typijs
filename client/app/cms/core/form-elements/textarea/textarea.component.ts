import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseElement } from './../base.element';

@Component({
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <textarea class="form-control" rows="4" 
                    [id]="id" 
                    [name]="propertyName"
                    [formControlName]="propertyName"></textarea>
            </div>
        </div>
    `
})
export class TextareaComponent extends BaseElement {
}