import { Component } from '@angular/core';
import { CmsProperty } from '@typijs/core';

// Try custom xHtml property, using the ng-wig instead of ngx-quill lib
@Component({
    selector: '[wigProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
            <div class="col-8">
                <div>
                    <ngx-wig #editor [formControlName]="propertyName"></ngx-wig>
                </div>
            </div>
        </div>
    `
})
export class NgxWigProperty extends CmsProperty { }
