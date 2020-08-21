import { Injectable, Injector } from '@angular/core';

import { CmsPropertyFactory, UIHint } from '@angular-cms/core';
import { ImageReferenceProperty } from './image-reference.property';

@Injectable()
export class ImagePropertyFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Image, ImageReferenceProperty);
    }
}
