import { Injectable, Injector } from '@angular/core';

import { CmsPropertyFactory, UIHint } from '@typijs/core';
import { NgxWigProperty } from './wig.property';

@Injectable()
export class NgxWigPropertyFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.XHtml, NgxWigProperty);
    }
}
