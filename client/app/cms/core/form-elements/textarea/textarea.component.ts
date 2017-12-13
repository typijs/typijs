import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseElement } from './../base.element';

@Component({
    template: `
        <div class="form-group row">
            <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <textarea class="form-control" [id]="id" rows="4"
                    [(ngModel)]="model[propertyName]" [name]="propertyName"></textarea>
            </div>
        </div>
    `
})
export class TextareaComponent extends BaseElement {
}