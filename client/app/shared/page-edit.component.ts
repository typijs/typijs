import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { PageEditDirective } from './page-edit-host.directive';
import { BaseComponent } from '../elements/base-element';

@Component({
    selector: 'app-page-edit',
    template: `
              <div>
                <h3>Page Edit Form</h3>
                <ng-template page-edit-host></ng-template>
              </div>
            `
})
export class PageEditComponent {
    private _pageInfo: any;
    @Input()
    set pageInfo(newValue) {
        this._pageInfo = newValue;
        this.loadComponent();
    }
    get pageInfo() {
        return this._pageInfo;
    }

    @ViewChild(PageEditDirective) pageEditHost: PageEditDirective;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    loadComponent() {
        if (this._pageInfo) {
            let viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            if (this._pageInfo.metadata.component) {
                let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this._pageInfo.metadata.component);
                let componentRef = viewContainerRef.createComponent(componentFactory);
            }

            if (this._pageInfo.properties)
                this._pageInfo.properties.forEach(element => {
                    let propertyFactory = this.componentFactoryResolver.resolveComponentFactory(element.formDisplayType);
                    let propertyComponent = viewContainerRef.createComponent(propertyFactory);
                    (<BaseComponent>propertyComponent.instance).title = element.displayName;
                });
        }
    }
}