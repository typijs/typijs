import {
    Block, ChildItemRef,
    CmsObject, CmsPropertyFactoryResolver, CmsTab,
    Content,
    ContentTypeProperty, InsertPointDirective,
    Media, Page, sortByString, TypeOfContent, TypeOfContentEnum
} from '@angular-cms/core';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { of, combineLatest, Observable, Subscription } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError, concatMap, auditTime } from 'rxjs/operators';
import { SubjectService } from '../../shared/services/subject.service';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';
import { ContentCrudService, ContentCrudServiceResolver, ContentInfo } from '../content-crud.service';

@Component({
    templateUrl: './content-update.component.html',
    styleUrls: ['./content-update.scss']
})
export class ContentUpdateComponent extends SubscriptionDestroy implements OnInit, OnDestroy, AfterViewInit {

    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    contentFormGroup: FormGroup = new FormGroup({});
    formTabs: Partial<CmsTab>[] = [];
    currentContent: Partial<Page> & Content;

    editMode: 'AllProperties' | 'OnPageEdit' = 'AllProperties';
    typeOfContent: TypeOfContent;
    previewUrl: string;

    showIframeHider = false;
    saveMessage: string = '';
    isPublishing = false;

    private readonly defaultGroup: string = 'Content';
    private contentService: ContentCrudService;
    private contentTypeProperties: ContentTypeProperty[] = [];
    private componentRefs: ComponentRef<any>[] = [];

    constructor(
        private contentServiceResolver: ContentCrudServiceResolver,
        private propertyFactoryResolver: CmsPropertyFactoryResolver,
        private subjectService: SubjectService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private changeDetectionRef: ChangeDetectorRef
    ) { super(); }

    ngOnInit() {
        combineLatest([this.route.paramMap, this.route.queryParamMap])
            .pipe(
                switchMap(([params, query]) => {
                    const contentId = params.get('id');
                    const versionId = query.get('versionId');
                    const language = query.get('language');
                    this.typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url);
                    this.contentService = this.contentServiceResolver.resolveCrudFormService(this.typeOfContent);
                    return contentId ? this.contentService.getContentVersion(contentId, versionId, language) : of({});
                }),
                tap((result: ContentInfo) => {
                    this.contentTypeProperties = result.contentTypeProperties;
                    this.previewUrl = result.previewUrl;
                }),
                map((result: ContentInfo) => result.contentData),
                catchError(error => {
                    return of({});
                }),
                takeUntil(this.unsubscribe$))
            .subscribe((contentData: Content) => {
                this.subjectService.fireContentSelected(this.typeOfContent, contentData);
                this.bindDataForContentForm(contentData);
            });

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

    publishContent(formId: any) {
        if (this.contentFormGroup.valid && this.currentContent && this.currentContent.status === 2) {
            this.saveMessage = '';
            this.isPublishing = true;
            const { _id, versionId } = this.currentContent;
            this.contentService.publishContentVersion(_id, versionId).pipe(
                catchError(error => {
                    return of(undefined);
                })
            ).subscribe((publishedContent: Partial<Page> & Content) => {
                this.isPublishing = false;
                formId.control.markAsPristine();
                if (publishedContent) {
                    this.saveMessage = 'Published';
                    if (publishedContent.status !== this.currentContent.status) {
                        Object.assign(this.currentContent, publishedContent);
                        this.subjectService.fireContentStatusChanged(this.typeOfContent, publishedContent);
                    }
                } else {
                    this.saveMessage = 'Publish Error';
                }
            });
        }
    }

    private getTypeContentFromUrl(url: UrlSegment[]): TypeOfContent {
        return url.length >= 2 && url[0].path === 'content' ? url[1].path : '';
    }
    /**
     * Binds data for content form and create the form group controls
     * @param contentData
     */
    private bindDataForContentForm(contentData: Page | Block | Media) {
        this.currentContent = this.getPopulatedContentData(contentData, this.contentTypeProperties);

        if (this.contentTypeProperties.length > 0) {
            this.formTabs = this.extractFormTabsFromProperties(this.contentTypeProperties);
            this.contentFormGroup = this.createFormGroup(this.contentTypeProperties);

            // implement the auto save function
            this.saveMessage = '';
            this.contentFormGroup.valueChanges.pipe(
                auditTime(3000),
                tap(() => this.saveMessage = 'Saving...'),
                concatMap(formValues => this.updateContent(formValues)),
                takeUntil(this.unsubscribe$)
            ).subscribe((savedContent: Content) => {
                if (savedContent) {
                    // update current content
                    this.saveMessage = 'Saved';
                    const { versionId, status } = this.currentContent;
                    Object.assign(this.currentContent, savedContent);

                    if (versionId !== savedContent.versionId || status !== savedContent.status) {
                        this.subjectService.fireContentStatusChanged(this.typeOfContent, savedContent);
                    }
                } else {
                    this.saveMessage = 'Save Error';
                }
            });
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

    private extractFormTabsFromProperties(properties: ContentTypeProperty[]): Partial<CmsTab>[] {
        const tabs: Partial<CmsTab>[] = [];

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

        return tabs.sort(sortByString('title', 'asc'));
    }

    /**
     * Creates Reactive Form from the properties of content
     * @param properties
     * @returns form group
     */
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


    /**
     * Create the default form controls such as content name, page url segment
     */
    private createDefaultFormControls(): { [key: string]: any } {
        const formControls: { [key: string]: any } = {};
        formControls.name = [this.currentContent.name, Validators.required];

        if (this.typeOfContent === TypeOfContentEnum.Page) {
            formControls.urlSegment = [this.currentContent.urlSegment, Validators.required];
        }
        return formControls;
    }

    /**
     * Creates the form controls corresponding to the properties of content type
     * @param properties
     * @returns property components
     */
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

    private updateContent(formValue: any): Observable<Content> {
        if (formValue) {

            // Extract the field's values such as name, url segment. These fields don't belong properties
            const contentDto: Partial<Content> = this.extractOwnPropertyValuesOfContent(formValue);
            Object.assign(this.currentContent, contentDto);
            // Extract the properties's values
            this.currentContent.properties = this.extractPropertiesPropertyOfContent(formValue);
            this.currentContent.childItems = this.extractChildItemsRefs();

            const { _id, versionId, properties, childItems } = this.currentContent;
            Object.assign(contentDto, { properties, childItems });

            return this.contentService.editContentVersion(_id, versionId, contentDto).pipe(catchError(error => {
                return of(undefined);
            }));
        }
    }

    private extractPropertiesPropertyOfContent(formValue: any): CmsObject {
        const properties = {};
        Object.keys(formValue).forEach(key => {
            if (!this.currentContent.hasOwnProperty(key)) {
                properties[key] = formValue[key];
            }
        });
        return properties;
    }

    private extractOwnPropertyValuesOfContent(formValue: any): CmsObject {
        const properties = {};
        Object.keys(formValue).forEach(key => {
            if (this.currentContent.hasOwnProperty(key)) {
                properties[key] = formValue[key];
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
