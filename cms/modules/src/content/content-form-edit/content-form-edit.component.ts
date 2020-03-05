import { Component, ViewChildren, QueryList, ComponentFactoryResolver, Inject, Injector, OnInit, ChangeDetectorRef, ComponentRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';

import { PROPERTY_METADATA_KEY, PROPERTIES_METADATA_KEY, Media, Block, Page, ChildItemRef, Content } from '@angular-cms/core';
import { CMS, UIHint, CmsProperty, InsertPointDirective, ISelectionFactory, PropertyMetadata, CmsTab, sortTabByTitle, clone } from '@angular-cms/core';
import { PageService, BlockService } from '@angular-cms/core';

import { PropertyListComponent } from '../../properties/property-list/property-list.component';
import { SelectProperty } from '../../properties/select/select-property';

import { PAGE_TYPE, BLOCK_TYPE, MEDIA_TYPE, FOLDER_BLOCK, FOLDER_MEDIA } from './../../constants';
import { SubjectService } from '../../shared/services/subject.service';
import { ContentAreaItem } from "../../properties/content-area/ContentAreaItem";
import { SubscriptionDestroy } from '../../shared/subscription-destroy';

type FormProperty = {
    name: string,
    metadata: PropertyMetadata
}

@Component({
    templateUrl: './content-form-edit.component.html'
})
export class ContentFormEditComponent extends SubscriptionDestroy implements OnInit {

    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    contentForm: FormGroup = new FormGroup({});
    formTabs: Array<CmsTab> = [];
    currentContent: Partial<Page> & Content;

    private typeOfContent: string;
    private propertyMetadatas: Array<FormProperty> = [];
    private componentRefs: Array<any> = [];
    private defaultGroup: string = "Content";

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private pageService: PageService,
        private blockService: BlockService,
        private subjectService: SubjectService,
        private changeDetectionRef: ChangeDetectorRef
    ) { super(); }

    ngOnInit() {
        this.subscriptions.push(this.route.params.subscribe(params => {
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
        }));
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

    private populateReferenceProperty(property: FormProperty): void {
        if (this.currentContent.properties) {
            const childItems = this.currentContent.childItems;
            const fieldType = property.metadata.displayType;
            switch (fieldType) {
                // Content Area
                case UIHint.ContentArea:
                    const contentAreaItems: ContentAreaItem[] = this.currentContent.properties[property.name]
                    if (Array.isArray(contentAreaItems)) {
                        contentAreaItems.forEach(areaItem => {
                            const matchItem = childItems.find(x => x.content._id == areaItem._id);
                            Object.assign(areaItem, { name: matchItem.content.name, isPublished: matchItem.content.isPublished })
                        })
                    }
                    this.currentContent.properties[property.name] = contentAreaItems;
                    break;
            }
        }
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

    updateContent(isPublished: boolean, formId: any) {
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

    //get all reference id of blocks in all content area
    private getChildItems(): ChildItemRef[] {
        const childItems: ChildItemRef[] = [];

        Object.keys(this.currentContent.properties).forEach(fieldName => {
            const fieldMeta = this.propertyMetadatas.find(x => x.name == fieldName);
            if (fieldMeta) {
                const fieldType = fieldMeta.metadata.displayType;

                switch (fieldType) {
                    case UIHint.ContentArea:
                        const contentAreaItems: ContentAreaItem[] = this.currentContent.properties[fieldName]
                        if (Array.isArray(contentAreaItems)) {
                            contentAreaItems.forEach(areaItem => {
                                if (childItems.findIndex(x => x.content && x.content == areaItem._id) == -1) {
                                    const refPath = this.getRefPathFromContentType(areaItem.type);
                                    if (refPath) childItems.push({ refPath: refPath, content: areaItem._id })
                                }
                            })
                        }
                        break;
                }
            }
        })
        return childItems;
    }

    private getRefPathFromContentType(contentAreaItemType: 'page' | 'block' | 'media' | 'folder_block' | 'folder_media'): 'cms_Block' | 'cms_Page' | 'cms_Media' {
        switch (contentAreaItemType) {
            case PAGE_TYPE: return 'cms_Page';
            case BLOCK_TYPE: return 'cms_Block';
            case FOLDER_BLOCK: return 'cms_Block';
            case MEDIA_TYPE: return 'cms_Media';
            case FOLDER_MEDIA: return 'cms_Media';
            default: return null;
        }
    }

    ngOnDestroy() {
        this.unsubscribe();

        if (this.componentRefs) {
            this.componentRefs.forEach(cmpref => {
                cmpref.destroy();
            })
            this.componentRefs = [];
        }
    }
}