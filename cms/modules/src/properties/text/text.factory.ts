import { Injectable, Injector } from '@angular/core';

import { CmsPropertyFactory, UIHint } from '@angular-cms/core';
import { TextProperty } from './text.property';

@Injectable()
export class TextPropertyFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Text, TextProperty);
    }
}
