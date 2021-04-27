import { Injectable, ComponentFactoryResolver, ComponentRef, InjectionToken, Injector, Inject, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsProperty } from './cms-property';
import { ClassOf, TypeOfContent } from '../types';
import { ContentTypeProperty } from '../types/content-type';
import { UIHint } from '../types/ui-hint';
import { Content, ChildItemRef } from '../services/content/models/content.model';
import { ContentTypeEnum } from '../constants/content-type.enum';

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_FACTORIES: InjectionToken<CmsPropertyFactory[]> = new InjectionToken<CmsPropertyFactory[]>('PROPERTY_FACTORIES');
// tslint:disable-next-line: max-line-length
export const DEFAULT_PROPERTY_FACTORIES: InjectionToken<CmsPropertyFactory[]> = new InjectionToken<CmsPropertyFactory[]>('DEFAULT_PROPERTY_FACTORIES');

export class CmsPropertyFactory {
    protected componentFactoryResolver: ComponentFactoryResolver;

    constructor(protected injector: Injector, protected propertyUIHint: string, protected propertyCtor: ClassOf<CmsProperty>) {
        this.componentFactoryResolver = injector.get(ComponentFactoryResolver);
    }

    isMatching(propertyUIHint: string): boolean {
        return this.propertyUIHint === propertyUIHint;
    }

    /**
     * Creates property component for content edit
     * @param property
     * @param formGroup
     * @returns property component
     */
    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        return this.createDefaultCmsPropertyComponent(property, formGroup);
    }

    /**
     * Fill up the data for the reference property which need to be populated such as ContentArea
     * @param contentData The current content
     * @param property The property info
     * @returns The value which is populated for reference property
     */
    getPopulatedReferenceProperty(contentData: Content, property: ContentTypeProperty): any {
        return contentData.properties[property.name];
    }

    /**
     * Extract child items ref from some special properties such as content area
     * @param contentData The current content
     * @returns child items ref
     */
    getChildItemsRef(contentData: Content, property: ContentTypeProperty): ChildItemRef[] {
        return [];
    }

    protected getRefPathFromContentType(typeOfContent: TypeOfContent): 'cms_Block' | 'cms_Page' | 'cms_Media' {
        switch (typeOfContent) {
            case ContentTypeEnum.Page: return 'cms_Page';
            case ContentTypeEnum.Block: return 'cms_Block';
            case ContentTypeEnum.FolderBlock: return 'cms_Block';
            case ContentTypeEnum.Media: return 'cms_Media';
            case ContentTypeEnum.FolderMedia: return 'cms_Media';
            default: return null;
        }
    }

    protected createDefaultCmsPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyFactory = this.componentFactoryResolver.resolveComponentFactory(this.propertyCtor);

        const propertyComponent = propertyFactory.create(this.injector);

        (<CmsProperty>propertyComponent.instance).property = property;
        (<CmsProperty>propertyComponent.instance).formGroup = formGroup;

        return propertyComponent;
    }
}

// TODO: In Angular 9, should use the providerIn: 'any' for this service. Detail: https://indepth.dev/angulars-root-and-any-provider-scopes/
/**
 * In Angular 9, should use the providerIn: 'any' for this service
 *
 * Detail: https://indepth.dev/angulars-root-and-any-provider-scopes/
 */
@Injectable()
export class CmsPropertyFactoryResolver {
    constructor(
        @Inject(DEFAULT_PROPERTY_FACTORIES) private defaultPropertyFactories: CmsPropertyFactory[],
        @Optional() @Inject(PROPERTY_FACTORIES) private propertyFactories?: CmsPropertyFactory[]) { }

    resolvePropertyFactory(uiHint: string): CmsPropertyFactory {
        let lastIndex = -1;
        if (this.propertyFactories) {
            lastIndex = this.propertyFactories.map(x => x.isMatching(uiHint)).lastIndexOf(true);
            if (lastIndex !== -1) { return this.propertyFactories[lastIndex]; }
        }

        lastIndex = this.defaultPropertyFactories.map(x => x.isMatching(uiHint)).lastIndexOf(true);
        if (lastIndex !== -1) { return this.defaultPropertyFactories[lastIndex]; }

        // Fallback to Text Property factory
        // tslint:disable-next-line: no-console
        console.warn(`The CMS can not resolve the Property Factory for the property with UIHint of ${uiHint}.\nThe default Text Factory will be returned`);
        lastIndex = this.defaultPropertyFactories.map(x => x.isMatching(UIHint.Text)).lastIndexOf(true);
        if (lastIndex === -1) { throw new Error(`The CMS can not resolve the Property Factory for the property with UIHint of ${UIHint.Text}`); }

        return this.defaultPropertyFactories[lastIndex];
    }
}
