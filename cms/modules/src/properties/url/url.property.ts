import { Component, Injectable, Injector, Input } from '@angular/core';
import { CmsProperty, CmsPropertyFactory, UIHint } from '@angular-cms/core';

@Component({
    selector: '[urlProperty]',
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
        <div class="col-5">
            <url-picker [formControlName]="propertyName"></url-picker>
        </div>
    </div>
  `
})
export class UrlProperty extends CmsProperty {}

@Injectable()
export class UrlPropertyFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Url, UrlProperty);
    }
}
