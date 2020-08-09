import { Injectable, ComponentFactoryResolver, ComponentRef, InjectionToken, Injector, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsProperty } from './cms-property';
import { ClassOf } from '../types';
import { ContentTypeProperty } from '../types/content-type';

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_PROVIDERS_TOKEN: InjectionToken<CmsPropertyFactory[]> = new InjectionToken<CmsPropertyFactory[]>('PROPERTY_PROVIDERS_TOKEN');

export class CmsPropertyFactory {
    protected componentFactoryResolver: ComponentFactoryResolver;

    constructor(protected injector: Injector, protected propertyUIHint: string, protected propertyCtor: ClassOf<CmsProperty>) {
        this.componentFactoryResolver = injector.get(ComponentFactoryResolver);
    }

    isMatching(propertyUIHint: string): boolean {
        return this.propertyUIHint == propertyUIHint;
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        return this.createDefaultCmsPropertyComponent(property, formGroup);
    }

    protected createDefaultCmsPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyFactory = this.componentFactoryResolver.resolveComponentFactory(this.propertyCtor);

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