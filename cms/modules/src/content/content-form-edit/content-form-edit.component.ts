import { Component, ViewChildren, QueryList, ComponentFactoryResolver, Inject, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PROPERTY_METADATA_KEY, PROPERTIES_METADATA_KEY } from '@angular-cms/core';
import { CMS, UIHint, CmsProperty, InsertPointDirective, ISelectionFactory, PropertyMetadata, CmsTab, sortTabByTitle, clone } from '@angular-cms/core';
import { PageService, BlockService, SubjectService } from '@angular-cms/core';

import { PropertyListComponent, SelectProperty } from '@angular-cms/properties';

import { PAGE_TYPE, BLOCK_TYPE } from './../../constants';

interface FormProperty {
    name: string,
    metadata: PropertyMetadata
}

@Component({
    templateUrl: './content-form-edit.component.html'
})
export class ContentFormEditComponent implements OnInit {
    private subParams: Subscription;

    contentForm: FormGroup = new FormGroup({});
    formTabs: Array<CmsTab> = [];
    currentContent: any;

    private typeOfContent: string;
    private propertyMetadatas: Array<FormProperty> = [];
    private componentRefs: Array<any> = [];
    private defaultGroup: string = "Content";

    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    constructor(
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private pageService: PageService,
        private blockService: BlockService,
        private subjectService: SubjectService,
        private _changeDetectionRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subParams = this.route.params.subscribe(params => {
            const contentId = params['id'] || '';
            this.typeOfContent = params['type'];

            if (contentId) {
                switch (this.typeOfContent) {
                    case PAGE_TYPE:
                        this.pageService.getContent(contentId).subscribe(contentData => {
                            this.subjectService.firePageSelected(contentData);
                            this.bindDataForContentForm(contentData, CMS.PAGE_TYPES[contentData.contentType])
                        });
                        break;
                    case BLOCK_TYPE:
                        this.blockService.getContent(contentId).subscribe(contentData => {
                            this.bindDataForContentForm(contentData, CMS.BLOCK_TYPES[contentData.contentType])
                        });
                        break;
                }
            }
        });
    }

    ngAfterViewInit() {
        this.insertPoints.changes.subscribe((newValue: QueryList<InsertPointDirective>) => {
            if (newValue.length > 0) {
                this.componentRefs = this.createFormControls(this.propertyMetadatas);
                this._changeDetectionRef.detectChanges();
            }
        });
    }

    private bindDataForContentForm(contentData, contentType) {
        this.currentContent = contentData;
        this.propertyMetadatas = [];

        if (contentType) {
            this.propertyMetadatas = this.createPropertyMetadatas(contentType);
            if (this.propertyMetadatas.length > 0) {
                this.propertyMetadatas.forEach(propertyMeta => this.populateReferenceProperty(propertyMeta));
                this.formTabs = this.createFormTabs(this.propertyMetadatas);
                this.contentForm = this.createFormGroup(this.propertyMetadatas);
                //this.componentRefs = this.createFormControls(this.propertyMetadatas);
            }
        }
    }

    private createPropertyMetadatas(contentType: string): Array<FormProperty> {
        let metadatas = [];
        let properties = Reflect.getMetadata(PROPERTIES_METADATA_KEY, contentType);
        if (properties) {
            properties.forEach(propertyName => {
                let propertyMeta: FormProperty = {
                    name: propertyName,
                    metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, contentType, propertyName)
                }

                metadatas.push(propertyMeta);
            });
        }
        return metadatas;
    }

    private createFormTabs(properties: Array<FormProperty>): Array<CmsTab> {
        let tabs = [];

        properties.forEach((property: FormProperty) => {
            if (property.metadata.hasOwnProperty('groupName')) {
                if (tabs.findIndex(x => x.title == property.metadata.groupName) == -1) {
                    tabs.push({ title: property.metadata.groupName, content: `${property.metadata.groupName}` });
                }
            }
        });

        if (properties.findIndex((property: FormProperty) => !property.metadata.groupName) != -1) {
            tabs.push({ title: this.defaultGroup, content: `${this.defaultGroup}` });
        }

        return tabs.sort(sortTabByTitle);
    }

    private createFormGroup(properties: Array<FormProperty>): FormGroup {
        if (properties) {
            let formModel = this.currentContent.properties ? this.currentContent.properties : {};
            let group = {};
            properties.forEach(property => {
                let validators = [];
                if (property.metadata.validates) {
                    property.metadata.validates.forEach(validate => {
                        validators.push(validate.validateFn);
                    })
                }

                group[property.name] = [formModel[property.name], validators]
            });
            return this.formBuilder.group(group);
        }
        return new FormGroup({})
    }

    private createFormControls(properties: Array<FormProperty>): Array<any> {
        let formControls = [];

        if (this.formTabs) {
            this.formTabs.forEach(tab => {
                let viewContainerRef = this.insertPoints.find(x => x.name == tab.content).viewContainerRef;
                viewContainerRef.clear();

                properties.filter(x => (x.metadata.groupName == tab.title || (!x.metadata.groupName && tab.title == this.defaultGroup))).forEach(property => {
                    if (CMS.PROPERTIES[property.metadata.displayType]) {
                        let propertyFactory = this.componentFactoryResolver.resolveComponentFactory(CMS.PROPERTIES[property.metadata.displayType]);
                        let propertyComponent = viewContainerRef.createComponent(propertyFactory);

                        (<CmsProperty>propertyComponent.instance).label = property.metadata.displayName;
                        (<CmsProperty>propertyComponent.instance).formGroup = this.contentForm;
                        (<CmsProperty>propertyComponent.instance).propertyName = property.name;

                        if (propertyComponent.instance instanceof SelectProperty) {
                            (<SelectProperty>propertyComponent.instance).selectItems = (<ISelectionFactory>(this.injector.get(property.metadata.selectionFactory))).GetSelections();
                        }
                        else if (propertyComponent.instance instanceof PropertyListComponent) {
                            (<PropertyListComponent>propertyComponent.instance).itemType = property.metadata.propertyListItemType;
                        }

                        formControls.push(propertyComponent);
                    }
                });
            });
        }

        return formControls;
    }

    //get all reference id of blocks in all content area
    private getChildItems(): Array<any> {
        let childItems = [];

        Object.keys(this.currentContent.properties).forEach(fieldName => {
            let fieldMeta = this.propertyMetadatas.find(x => x.name == fieldName);
            if (fieldMeta) {
                let fieldType = fieldMeta.metadata.displayType;

                switch (fieldType) {
                    case UIHint.ContentArea:
                        let fieldValue = this.currentContent.properties[fieldName]
                        if (Array.isArray(fieldValue)) {
                            fieldValue.forEach(item => {
                                if (childItems.findIndex(x => x.content == item._id) == -1)
                                    childItems.push({
                                        refPath: 'cms_Block', //TODO: need to get path based on item which drop on content area
                                        content: item._id
                                    })
                            })
                        }
                        break;
                }
            }
        })
        return childItems;
    }

    private populateReferenceProperty(property: any): void {
        if (this.currentContent.properties) {
            let childItems = this.currentContent.childItems;
            let fieldType = property.metadata.displayType;
            switch (fieldType) {
                // Content Area
                case UIHint.ContentArea:
                    let fieldValue = this.currentContent.properties[property.name]
                    if (Array.isArray(fieldValue)) {
                        for (var i = 0; i < fieldValue.length; i++) {
                            let matchItem = childItems.find(x => x.content._id == fieldValue[i]._id);
                            if (matchItem) {
                                fieldValue[i] = clone(matchItem.itemId);
                            }
                        }
                    }
                    this.currentContent.properties[property.name] = fieldValue;
                    break;
            }
        }
    }

    onSubmit(isPublished: boolean, formId: any) {
        console.log(this.contentForm.value);

        if (this.contentForm.valid) {
            if (this.currentContent) {
                this.currentContent.properties = this.contentForm.value;
                this.currentContent.isDirty = formId.dirty;
                this.currentContent.isPublished = isPublished;
                this.currentContent.childItems = this.getChildItems();

                switch (this.typeOfContent) {
                    case PAGE_TYPE:
                        if (this.currentContent.isDirty || this.currentContent.isPublished) {
                            this.pageService.editContent(this.currentContent).subscribe(res => {
                                formId.control.markAsPristine();
                            })
                        }
                        break;
                    case BLOCK_TYPE:
                        if (this.currentContent.isDirty) {
                            this.blockService.editContent(this.currentContent).subscribe(res => {
                                formId.control.markAsPristine();
                            })
                        }
                        break;
                }

            }
        }
    }

    ngOnDestroy() {
        this.subParams.unsubscribe();

        if (this.componentRefs) {
            this.componentRefs.forEach(cmpref => {
                cmpref.destroy();
            })
            this.componentRefs = [];
        }
    }
}