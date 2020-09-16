import {
    Block, ChildItemRef,
    CmsObject, CmsPropertyFactoryResolver, CmsTab,
    Content,
    ContentTypeProperty, InsertPointDirective,
    Media, Page, sortTabByTitle, TypeOfContent
} from '@angular-cms/core';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SubjectService } from '../../shared/services/subject.service';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';
import { ContentFormService, ContentFormServiceResolver, ContentInfo } from '../content-form.service';

@Component({
    templateUrl: './content-form-edit.component.html',
    styleUrls: ['./content-form-edit.scss']
})
export class ContentFormEditComponent extends SubscriptionDestroy implements OnInit, OnDestroy, AfterViewInit {

    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    contentFormGroup: FormGroup = new FormGroup({});
    formTabs: CmsTab[] = [];
    currentContent: Partial<Page> & Content;
    editMode: 'AllProperties' | 'OnPageEdit' = 'AllProperties';

    showIframeHider = false;
    previewUrl: string;

    private contentService: ContentFormService;
    private readonly defaultGroup: string = 'Content';
    private contentTypeProperties: ContentTypeProperty[] = [];
    private componentRefs: ComponentRef<any>[] = [];

    constructor(
        private contentServiceResolver: ContentFormServiceResolver,
        private propertyFactoryResolver: CmsPropertyFactoryResolver,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private subjectService: SubjectService,
        private changeDetectionRef: ChangeDetectorRef
    ) { super(); }

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap(params => {
                    const contentId = params.id;
                    const typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url);
                    this.contentService = this.contentServiceResolver.resolveContentFormService(typeOfContent);

                    return contentId ? this.contentService.getContent(contentId) : of({});
                }),
                tap((result: ContentInfo) => {
                    this.contentTypeProperties = result.contentTypeProperties;
                    this.previewUrl = result.previewUrl;
                }),
                map((result: ContentInfo) => result.contentData),
                takeUntil(this.unsubscribe$))
            .subscribe((contentData: Content) => this.bindDataForContentForm(contentData));

        this.subjectService.portalLayoutChanged$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((showIframeHider: boolean) => {
                this.showIframeHider = showIframeHider;
            });
    }

    ngAfterViewInit() {
        this.insertPoints.changes.subscribe((newValue: QueryList<InsertPointDirective>) => {
            if (newValue.length > 0) {
                this.componentRefs = this.createPropertyComponents(this.contentTypeProperties);
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    private getTypeContentFromUrl(url: UrlSegment[]): TypeOfContent {
        return url.length >= 2 && url[0].path === 'content' ? url[1].path : '';
    }

    private bindDataForContentForm(contentData: Page | Block | Media) {
        this.currentContent = this.getPopulatedContentData(contentData, this.contentTypeProperties);

        if (this.contentTypeProperties.length > 0) {
            this.formTabs = this.extractFormTabsFromProperties(this.contentTypeProperties);
            this.contentFormGroup = this.createFormGroup(this.contentTypeProperties);
        }
    }

    private getPopulatedContentData(contentData: Page | Block | Media, propertiesMetadata: ContentTypeProperty[]): Partial<Page> & Content {
        propertiesMetadata.forEach(propertyMeta => {
            if (contentData.properties) {
                const propertyFactory = this.propertyFactoryResolver.resolvePropertyFactory(propertyMeta.metadata.displayType);
                contentData.properties[propertyMeta.name] = propertyFactory.getPopulatedReferenceProperty(contentData, propertyMeta);
            }
        });

        return contentData;
    }

    private extractFormTabsFromProperties(properties: ContentTypeProperty[]): CmsTab[] {
        const tabs: CmsTab[] = [];

        properties.forEach((property: ContentTypeProperty) => {
            if (property.metadata.hasOwnProperty('groupName')) {
                if (tabs.findIndex(x => x.title == property.metadata.groupName) == -1) {
                    tabs.push({ title: property.metadata.groupName, name: `${property.metadata.groupName}` });
                }
            }
        });

        if (properties.findIndex((property: ContentTypeProperty) => !property.metadata.groupName) != -1) {
            tabs.push({ title: this.defaultGroup, name: `${this.defaultGroup}` });
        }

        return tabs.sort(sortTabByTitle);
    }

    private createFormGroup(properties: ContentTypeProperty[]): FormGroup {
        if (properties) {
            const formModel = this.currentContent.properties ? this.currentContent.properties : {};
            const formControls: { [key: string]: any } = this.createDefaultFormControls();

            properties.forEach(property => {
                const validators = [];
                if (property.metadata.validates) {
                    property.metadata.validates.forEach(validate => {
                        validators.push(validate.validateFn);
                    });
                }
                formControls[property.name] = [formModel[property.name], validators];
            });
            return this.formBuilder.group(formControls);
        }
        return new FormGroup({});
    }

    private createDefaultFormControls(): { [key: string]: any } {
        const formControls: { [key: string]: any } = {};
        formControls.name = [this.currentContent.name, Validators.required];
        return formControls;
    }

    private createPropertyComponents(properties: ContentTypeProperty[]): ComponentRef<any>[] {
        const propertyControls: ComponentRef<any>[] = [];

        if (!this.formTabs || this.formTabs.length === 0) { return propertyControls; }

        this.formTabs.forEach(tab => {
            const viewContainerRef = this.insertPoints.find(x => x.name === tab.name).viewContainerRef;
            viewContainerRef.clear();

            properties.filter(x => (x.metadata.groupName === tab.title || (!x.metadata.groupName && tab.title === this.defaultGroup)))
                .forEach(property => {
                    try {
                        const propertyFactory = this.propertyFactoryResolver.resolvePropertyFactory(property.metadata.displayType);
                        const propertyComponent = propertyFactory.createPropertyComponent(property, this.contentFormGroup);
                        viewContainerRef.insert(propertyComponent.hostView);
                        propertyControls.push(propertyComponent);
                    } catch (error) {
                        console.error(error);
                    }
                });
        });

        return propertyControls;
    }

    updateContent(isPublished: boolean, formId: any) {
        if (this.contentFormGroup.valid) {
            if (this.currentContent) {
                Object.assign(this.currentContent, this.extractOwnPropertyValuesOfContent(this.contentFormGroup));
                this.currentContent.properties = this.extractPropertiesPropertyOfContent(this.contentFormGroup);
                this.currentContent.childItems = this.extractChildItemsRefs();
                this.currentContent.isDirty = formId.dirty;
                this.currentContent.isPublished = isPublished;

                if (this.currentContent.isDirty || this.currentContent.isPublished) {
                    this.contentService.editContent(this.currentContent).subscribe(res => {
                        formId.control.markAsPristine();
                    });
                }
            }
        }
    }

    private extractPropertiesPropertyOfContent(formGroup: FormGroup): CmsObject {
        const properties = {};
        Object.keys(formGroup.value).forEach(key => {
            if (!this.currentContent.hasOwnProperty(key)) {
                properties[key] = formGroup.value[key];
            }
        });
        return properties;
    }

    private extractOwnPropertyValuesOfContent(formGroup: FormGroup): CmsObject {
        const properties = {};
        Object.keys(formGroup.value).forEach(key => {
            if (this.currentContent.hasOwnProperty(key)) {
                properties[key] = formGroup.value[key];
            }
        });
        return properties;
    }

    // get all reference id of blocks in all content area
    private extractChildItemsRefs(): ChildItemRef[] {
        const childItems: ChildItemRef[] = [];

        Object.keys(this.currentContent.properties).forEach(propertyName => {
            const property = this.contentTypeProperties.find(x => x.name === propertyName);
            if (property) {
                const propertyType = property.metadata.displayType;
                const propertyFactory = this.propertyFactoryResolver.resolvePropertyFactory(propertyType);
                const propertyChildItems = propertyFactory.getChildItemsRef(this.currentContent, property);
                if (propertyChildItems.length > 0) {
                    childItems.push(...propertyChildItems);
                }
            }
        });
        return childItems;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.insertPoints) {
            this.insertPoints.map(x => x.viewContainerRef).forEach(containerRef => containerRef.clear());
        }

        if (this.componentRefs) {
            this.componentRefs.forEach(cmpRef => { cmpRef.destroy(); });
            this.componentRefs = [];
        }
    }
}
