import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy, Inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { InsertPointDirective } from './../../../core/directives';
import { BaseElement } from './../../../core/form-elements';
import { SelectComponent } from './../../../core/form-elements/select/select.component';
import { ISelectionFactory } from './../../../core/form-elements';

import { ContentService } from './../../../core/services';
import CMS from '../../../core';
import { PAGE_TYPE_METADATA_KEY, PROPERTY_METADATA_KEY, PROPERTIES_METADATA_KEY } from './../../../core/constants';

@Component({
    templateUrl: './content-form-edit.component.html',
})
export class ContentFormEditComponent implements OnInit {
    subParams: Subscription;

    @ViewChild(InsertPointDirective) pageEditHost: InsertPointDirective;

    constructor( @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector,
        private contentService: ContentService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.subParams = this.route.params.subscribe(params => {
            let contentId = params['id'] || '';
            if (contentId)
                this.contentService.getContent({ _id: contentId }).subscribe(res => {
                    console.log(res);
                    let contentType = CMS.PAGE_TYPES.find(x => x.name == res.contentType);
                    if (contentType) {
                        let properties = Reflect.getMetadata(PROPERTIES_METADATA_KEY, contentType);
                        let propertiesMetadata = [];
                        if (properties)
                            properties.forEach(element => {
                                propertiesMetadata.push(Reflect.getMetadata(PROPERTY_METADATA_KEY, contentType, element))
                            });

                        if (propertiesMetadata.length > 0) {
                            this.loadComponent(propertiesMetadata);
                        }
                    }
                });
        });
    }

    loadComponent(properties) {
        if (properties) {
            let viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            // if (this._pageInfo.metadata.componentRef) {
            //     let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this._pageInfo.metadata.componentRef);
            //     let componentRef = viewContainerRef.createComponent(componentFactory);
            // }

            if (properties)
                properties.forEach(element => {
                    let propertyFactory = this.componentFactoryResolver.resolveComponentFactory(element.displayType);
                    let propertyComponent = viewContainerRef.createComponent(propertyFactory);
                    (<BaseElement>propertyComponent.instance).label = element.displayName;

                    if (propertyComponent.instance instanceof SelectComponent) {
                        console.log("this is select component");
                        (<SelectComponent>propertyComponent.instance).selectItems = (<ISelectionFactory>(this.injector.get(element.selectionFactory))).GetSelections();
                    }
                });
        }
    }
}