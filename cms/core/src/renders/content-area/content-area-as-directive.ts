import { Component, ElementRef, EventEmitter, Injector, Input, Output } from '@angular/core';
import { Content } from '../../services/content/models/content.model';
import { ContentReference } from '../../types/content-reference';
import { PropertyDirectiveBase } from '../property-directive.base';

@Component({
    selector: '[cmsContentArea]',
    exportAs: 'contentArea',
    template: `<ng-container [contentArea]="contentAreaItems" (contentLoaded)="contentLoaded.emit()"></ng-container><ng-content></ng-content>`
})
export class ContentAreaRenderDirective extends PropertyDirectiveBase {

    @Output() contentLoaded = new EventEmitter();
    @Input('cmsContentArea') contentAreaItems: Array<ContentReference & Partial<Content>>;

    constructor(injector: Injector, elementRef: ElementRef) {
        super(injector, elementRef);
    }
}
