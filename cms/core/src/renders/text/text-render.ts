import { Component, Injectable, Injector } from '@angular/core';
import { UIHint } from '../../types/ui-hint';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'span',
    template: `{{value}}`
})
export class TextPropertyRender extends CmsPropertyRender<string> { }

@Injectable()
export class TextRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Text, TextPropertyRender);
    }
}

@Injectable()
export class TextareaRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Textarea, TextPropertyRender);
    }
}