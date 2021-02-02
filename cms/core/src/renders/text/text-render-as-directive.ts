import { Component, Input, Injector, ElementRef } from '@angular/core';
import { PropertyDirectiveBase } from '../property-directive.base';

@Component({
    selector: '[cmsText]',
    template: `{{cmsText}}<ng-content></ng-content>`
})
export class TextRenderDirective extends PropertyDirectiveBase {
    @Input() cmsText: string;
    constructor(injector: Injector, elementRef: ElementRef) {
        super(injector, elementRef);
    }
}
