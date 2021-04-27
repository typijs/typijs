import { Component } from '@angular/core';
import { CmsProperty } from '@typijs/core';

@Component({
    selector: '[textareaProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
            <div class="col-5">
                <textarea class="form-control" rows="4"
                    [id]="id"
                    [name]="propertyName"
                    [formControlName]="propertyName"></textarea>
            </div>
        </div>
    `
})
export class TextareaProperty extends CmsProperty {
}
