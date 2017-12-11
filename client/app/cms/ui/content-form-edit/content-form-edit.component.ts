import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy, Inject, Injector } from '@angular/core';

import { InsertPointDirective } from './../../core/directives';
import { BaseElement } from './../../core/form-elements';
import { SelectComponent } from './../../core/form-elements/select/select.component';
import { ISelectionFactory } from './../../core/form-elements';

@Component({
    selector: 'content-form-edit',
    template: `
              <div>
                <h3>Page Edit Form</h3>
                <ng-template insert-point></ng-template>
              </div>
            `
})
export class ContentFormEditComponent {
    private _pageInfo: any;
    @Input()
    set pageInfo(newValue) {
        this._pageInfo = newValue;
        this.loadComponent();
    }
    get pageInfo() {
        return this._pageInfo;
    }

    @ViewChild(InsertPointDirective) pageEditHost: InsertPointDirective;

    constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) { }

    loadComponent() {
        if (this._pageInfo) { 
            let viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            if (this._pageInfo.metadata.componentRef) {
                let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this._pageInfo.metadata.componentRef);
                let componentRef = viewContainerRef.createComponent(componentFactory);
            }

            if (this._pageInfo.properties)
                this._pageInfo.properties.forEach(element => {
                    let propertyFactory = this.componentFactoryResolver.resolveComponentFactory(element.displayType);
                    let propertyComponent = viewContainerRef.createComponent(propertyFactory);
                    (<BaseElement>propertyComponent.instance).label = element.displayName;

                    if(propertyComponent.instance instanceof SelectComponent) {
                        console.log("this is select component");
                        (<SelectComponent>propertyComponent.instance).selectItems =(<ISelectionFactory>(this.injector.get(element.selectionFactory))).GetSelections();
                    }
                });
        }
    }
}