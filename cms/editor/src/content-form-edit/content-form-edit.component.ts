import { Component, Input, AfterViewInit, ViewChild, ComponentFactoryResolver, OnDestroy, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PAGE_TYPE_METADATA_KEY, PROPERTY_METADATA_KEY, PROPERTIES_METADATA_KEY } from '@angular-cms/core';
import { CMS, UIType, InsertPointDirective, ContentService, Content } from '@angular-cms/core';

import { BaseElement, Elements, ISelectionFactory, PropertyListComponent, SelectElement } from '@angular-cms/form';


@Component({
    templateUrl: './content-form-edit.component.html',
})
export class ContentFormEditComponent implements OnInit {
    subParams: Subscription;
    contentForm: any;

    formModel: any = {};
    private currentContent: Content;

    @ViewChild(InsertPointDirective) pageEditHost: InsertPointDirective;

    constructor(
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private formBuilder: FormBuilder,
        private contentService: ContentService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.contentForm = new FormGroup({});
        this.subParams = this.route.params.subscribe(params => {
            let contentId = params['id'] || '';
            if (contentId)
                this.contentService.getContent({ _id: contentId }).subscribe(res => {
                    this.currentContent = res;
                    if (this.currentContent.properties)
                        this.formModel = this.currentContent.properties;

                    let contentType = CMS.PAGE_TYPES[res.contentType];
                    if (contentType) {
                        let properties = Reflect.getMetadata(PROPERTIES_METADATA_KEY, contentType);
                        let propertiesMetadata = [];
                        if (properties)
                            properties.forEach(element => {
                                propertiesMetadata.push({
                                    name: element,
                                    metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, contentType, element)
                                })
                            });

                        if (propertiesMetadata.length > 0) {
                            this.createFormGroup(propertiesMetadata);
                            this.createFormControls(propertiesMetadata);
                        }
                    }
                });
        });
    }

    createFormGroup(properties) {
        if (properties) {
            let group = {};
            properties.forEach(property => {
                console.log(property);
                let validators = [];
                if (property.metadata.validates) {
                    property.metadata.validates.forEach(validate => {
                        validators.push(validate.validateFn);
                    })
                }

                group[property.name] = [this.formModel[property.name], validators]
            });
            this.contentForm = this.formBuilder.group(group)
        }
    }

    createFormControls(properties) {
        if (properties) {
            let viewContainerRef = this.pageEditHost.viewContainerRef;
            viewContainerRef.clear();

            properties.forEach(property => {
                let propertyFactory = this.componentFactoryResolver.resolveComponentFactory(Elements[property.metadata.displayType]);
                let propertyComponent = viewContainerRef.createComponent(propertyFactory);
                (<BaseElement>propertyComponent.instance).label = property.metadata.displayName;
                (<BaseElement>propertyComponent.instance).formGroup = this.contentForm;
                (<BaseElement>propertyComponent.instance).propertyName = property.name;

                if (propertyComponent.instance instanceof SelectElement) {
                    (<SelectElement>propertyComponent.instance).selectItems = (<ISelectionFactory>(this.injector.get(property.metadata.selectionFactory))).GetSelections();
                } else if (propertyComponent.instance instanceof PropertyListComponent) {
                    (<PropertyListComponent>propertyComponent.instance).itemType = property.metadata.propertyListItemType;
                }
            });
        }
    }

    onSubmit() {
        console.log(this.contentForm.value);
        if (this.contentForm.valid) {
            if (this.currentContent) {
                this.currentContent.properties = this.contentForm.value;
                this.contentService.editContent(this.currentContent).subscribe(res => {
                    console.log(res);
                })
            }
        }
    }
}