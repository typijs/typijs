import { Injectable, ComponentFactoryResolver, ComponentRef, InjectionToken, Injector, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CMS } from '../cms';
import { CmsProperty } from './cms-property';
import { ClassOf } from '../types';
import { ContentTypeProperty } from '../types/content-type';

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_PROVIDERS_TOKEN: InjectionToken<CmsPropertyFactory[]> = new InjectionToken<CmsPropertyFactory[]>('PROPERTY_PROVIDERS_TOKEN');

export function getCmsPropertyFactory(propertyUIHint: string) {
    return (injector: Injector): CmsPropertyFactory => {
        return new CmsPropertyFactory(propertyUIHint, injector)
    };
};

export class CmsPropertyFactory {
    protected propertyUIHint: string;
    protected componentFactoryResolver: ComponentFactoryResolver;
    protected injector: Injector;

    constructor(propertyUIHint: string, injector: Injector) {
        this.propertyUIHint = propertyUIHint;
        this.injector = injector;
        this.componentFactoryResolver = injector.get(ComponentFactoryResolver);
    }

    isMatching(propertyUIHint: string): boolean {
        return this.propertyUIHint == propertyUIHint;
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        return this.createDefaultCmsPropertyComponent(property, formGroup);
    }

    protected getRegisteredPropertyComponent(): ClassOf<CmsProperty> {
        if (!CMS.PROPERTIES[this.propertyUIHint])
            throw new Error(`The CMS don't have the property with UIHint of ${this.propertyUIHint}`);

        return CMS.PROPERTIES[this.propertyUIHint];
    }

    protected createDefaultCmsPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponentClass = this.getRegisteredPropertyComponent();

        const propertyFactory = this.componentFactoryResolver.resolveComponentFactory(propertyComponentClass);

        const propertyComponent = propertyFactory.create(this.injector);

        (<CmsProperty>propertyComponent.instance).property = property;
        (<CmsProperty>propertyComponent.instance).formGroup = formGroup;

        return propertyComponent;
    }
}

//TODO: In Angular 9, should use the providerIn: 'any' for this service. Detail: https://indepth.dev/angulars-root-and-any-provider-scopes/
/**
 * In Angular 9, should use the providerIn: 'any' for this service
 * 
 * Detail: https://indepth.dev/angulars-root-and-any-provider-scopes/
 */
@Injectable()
export class CmsPropertyFactoryResolver {
    constructor(@Inject(PROPERTY_PROVIDERS_TOKEN) private propertyFactories: CmsPropertyFactory[]) { }

    resolvePropertyFactory(uiHint: string): CmsPropertyFactory {
        //TODO: Need to get last element to allow override factory
        const propertyFactory = this.propertyFactories.find(x => x.isMatching(uiHint));
        if (!propertyFactory)
            throw new Error(`The CMS can not resolve the Property Factor for the property with UIHint of ${uiHint}`);

        return propertyFactory;
    }
}