import { Injectable, Injector } from '@angular/core';

import { CmsPropertyFactory, UIHint } from '@typijs/core';
import { XHtmlProperty } from './xhtml.property';

@Injectable()
export class XHtmlPropertyFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.XHtml, XHtmlProperty);
    }
}
