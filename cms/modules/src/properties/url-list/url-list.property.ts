import { Component, Injectable, Injector } from '@angular/core';
import { CmsProperty, CmsPropertyFactory, UIHint } from '@typijs/core';
@Component({
    selector: '[urlListProperty]',
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
        <div class="col-5">
            <url-list [formControlName]="propertyName"></url-list>
        </div>
    </div>
  `
})
export class UrlListProperty extends CmsProperty { }

@Injectable()
export class UrlListPropertyFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.UrlList, UrlListProperty);
    }
}

