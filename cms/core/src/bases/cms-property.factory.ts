import { Injectable, ComponentFactoryResolver, ComponentRef, InjectionToken, Injector, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsProperty } from './cms-property';
import { ClassOf } from '../types';
import { ContentTypeProperty } from '../types/content-type';

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_FACTORIES: InjectionToken<CmsPropertyFactory[]> = new InjectionToken<CmsPropertyFactory[]>('PROPERTY_FACTORIES');
export const DEFAULT_PROPERTY_FACTORIES: InjectionToken<CmsPropertyFactory[]> = new InjectionToken<CmsPropertyFactory[]>('DEFAULT_PROPERTY_FACTORIES');

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
    constructor(
        @Inject(DEFAULT_PROPERTY_FACTORIES) private defaultPropertyFactories: CmsPropertyFactory[],
        @Inject(PROPERTY_FACTORIES) private propertyFactories: CmsPropertyFactory[]) { }

    resolvePropertyFactory(uiHint: string): CmsPropertyFactory {
        //TODO: Need to get last element to allow override factory
        let lastIndex = this.propertyFactories.map(x => x.isMatching(uiHint)).lastIndexOf(true);
        if (lastIndex == -1) {
            lastIndex = this.defaultPropertyFactories.map(x => x.isMatching(uiHint)).lastIndexOf(true);
        } else {
            return this.propertyFactories[lastIndex];
        }

        if (lastIndex == -1) throw new Error(`The CMS can not resolve the Property Factor for the property with UIHint of ${uiHint}`);
        return this.defaultPropertyFactories[lastIndex];;
    }
}