import { Component, ViewChildren, QueryList, ComponentFactoryResolver, Inject, Injector, OnInit, ChangeDetectorRef, ComponentRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs';

import { PROPERTY_METADATA_KEY, PROPERTIES_METADATA_KEY, Media, Block, Page, ChildItemRef, Content } from '@angular-cms/core';
import { CMS, UIHint, CmsProperty, InsertPointDirective, ISelectionFactory, PropertyMetadata, CmsTab, sortTabByTitle, clone } from '@angular-cms/core';
import { PageService, BlockService } from '@angular-cms/core';

import { PropertyListComponent } from '../../properties/property-list/property-list.component';
import { SelectProperty } from '../../properties/select/select-property';

import { PAGE_TYPE, BLOCK_TYPE } from './../../constants';
import { SubjectService } from '../../shared/services/subject.service';

type FormProperty = {
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
    currentContent: Partial<Page> & Content;

    private typeOfContent: string;
    private propertyMetadatas: Array<FormProperty> = [];
    private componentRefs: Array<any> = [];
    private defaultGroup: string = "Content";

    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private pageService: PageService,
        private blockService: BlockService,
        private subjectService: SubjectService,
        private changeDetectionRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subParams = this.route.params.subscribe(params => {
            const contentId = params['id'] || '';
            const url: UrlSegment[] = this.route.snapshot.url;
            this.typeOfContent = url.length >= 2 && url[0].path == 'content' ? url[1].path : '';

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
                this.componentRefs = this.createPropertyComponents(this.propertyMetadatas);
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    private bindDataForContentForm(contentData: Page | Block | Media, contentType: string) {
        this.currentContent = contentData;
        this.propertyMetadatas = [];

        if (contentType) {
            this.propertyMetadatas = this.createPropertyMetadatas(contentType);
            if (this.propertyMetadatas.length > 0) {
                this.propertyMetadatas.forEach(propertyMeta => this.populateReferenceProperty(propertyMeta));
                this.formTabs = this.createFormTabs(this.propertyMetadatas);
                this.contentForm = this.createFormGroup(this.propertyMetadatas);
            }
        }
    }

    private createPropertyMetadatas(contentType: string): Array<FormProperty> {
        const metadatas = [];
        //get all properties of content type
        const properties: string[] = Reflect.getMetadata(PROPERTIES_METADATA_KEY, contentType);
        if (properties) {
            properties.forEach(propertyName => {
                const propertyMeta: FormProperty = {
                    name: propertyName,
                    metadata: Reflect.getMetadata(PROPERTY_METADATA_KEY, contentType, propertyName)
                }

                metadatas.push(propertyMeta);
            });
        }
        return metadatas;
    }

    private createFormTabs(properties: Array<FormProperty>): Array<CmsTab> {
        const tabs: CmsTab[] = [];

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
            const formModel = this.currentContent.properties ? this.currentContent.properties : {};
            const formControls: { [key: string]: any } = this.createDefaultFormControls();
            properties.forEach(property => {
                const validators = [];
                if (property.metadata.validates) {
                    property.metadata.validates.forEach(validate => {
                        validators.push(validate.validateFn);
                    })
                }

                formControls[property.name] = [formModel[property.name], validators]
            });
            return this.formBuilder.group(formControls);
        }
        return new FormGroup({})
    }

    private createDefaultFormControls(): { [key: string]: any } {
        const formControls: { [key: string]: any } = {};
        formControls["name"] = [this.currentContent.name, Validators.required];
        return formControls;
    }

    private createPropertyComponents(properties: Array<FormProperty>): ComponentRef<any>[] {
        const formControls: ComponentRef<any>[] = [];

        if (this.formTabs) {
            this.formTabs.forEach(tab => {
                const viewContainerRef = this.insertPoints.find(x => x.name == tab.content).viewContainerRef;
                viewContainerRef.clear();

                properties.filter(x => (x.metadata.groupName == tab.title || (!x.metadata.groupName && tab.title == this.defaultGroup))).forEach(property => {
                    if (CMS.PROPERTIES[property.metadata.displayType]) {
                        const propertyFactory = this.componentFactoryResolver.resolveComponentFactory(CMS.PROPERTIES[property.metadata.displayType]);
                        const propertyComponent = viewContainerRef.createComponent(propertyFactory);

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
    private getChildItems(): ChildItemRef[] {
        const childItems: ChildItemRef[] = [];

        Object.keys(this.currentContent.properties).forEach(fieldName => {
            const fieldMeta = this.propertyMetadatas.find(x => x.name == fieldName);
            if (fieldMeta) {
                const fieldType = fieldMeta.metadata.displayType;

                switch (fieldType) {
                    case UIHint.ContentArea:
                        const fieldValue = this.currentContent.properties[fieldName]
                        if (Array.isArray(fieldValue)) {
                            fieldValue.forEach(item => {
                                if (childItems.findIndex(x => x.content && x.content == item._id) == -1)
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

    private populateReferenceProperty(property: FormProperty): void {
        if (this.currentContent.properties) {
            const childItems = this.currentContent.childItems;
            const fieldType = property.metadata.displayType;
            switch (fieldType) {
                // Content Area
                case UIHint.ContentArea:
                    const fieldValue = this.currentContent.properties[property.name]
                    if (Array.isArray(fieldValue)) {
                        for (let i = 0; i < fieldValue.length; i++) {
                            const matchItem = childItems.find(x => x.content._id == fieldValue[i]._id);
                            if (matchItem) {
                                fieldValue[i] = clone(matchItem.content);
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
                const properties = {};
                Object.keys(this.contentForm.value).forEach(key => {
                    if (this.currentContent.hasOwnProperty(key)) {
                        this.currentContent[key] = this.contentForm.value[key]
                    }
                    else {
                        properties[key] = this.contentForm.value[key];
                    }
                });
                this.currentContent.properties = properties;
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
                        if (this.currentContent.isDirty || this.currentContent.isPublished) {
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