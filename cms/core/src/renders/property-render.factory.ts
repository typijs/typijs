import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';

import { ClassOf } from '../types';
import { ContentTypeProperty } from '../types/content-type';
import { CmsPropertyRender } from './property-render';
import { UIHint } from '../types/ui-hint';

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
// tslint:disable-next-line: max-line-length
export const PROPERTY_RENDERS: InjectionToken<CmsPropertyRenderFactory[]> = new InjectionToken<CmsPropertyRenderFactory[]>('PROPERTY_RENDERS');
// tslint:disable-next-line: max-line-length
export const DEFAULT_PROPERTY_RENDERS: InjectionToken<CmsPropertyRenderFactory[]> = new InjectionToken<CmsPropertyRenderFactory[]>('DEFAULT_PROPERTY_RENDERS');

export class CmsPropertyRenderFactory {
    protected componentFactoryResolver: ComponentFactoryResolver;

    constructor(protected injector: Injector, protected propertyUIHint: string, protected propertyCtor: ClassOf<CmsPropertyRender<any>>) {
        this.componentFactoryResolver = injector.get(ComponentFactoryResolver);
    }

    isMatching(propertyUIHint: string): boolean {
        return this.propertyUIHint == propertyUIHint;
    }

    createPropertyComponent(property: ContentTypeProperty, propertyValue: any): ComponentRef<any> {
        return this.createDefaultCmsPropertyComponent(property, propertyValue);
    }

    protected createDefaultCmsPropertyComponent(property: ContentTypeProperty, propertyValue: any): ComponentRef<any> {
        const propertyFactory = this.componentFactoryResolver.resolveComponentFactory(this.propertyCtor);

        const propertyComponent = propertyFactory.create(this.injector);

        (<CmsPropertyRender<any>>propertyComponent.instance).property = property;
        (<CmsPropertyRender<any>>propertyComponent.instance).value = propertyValue;

        return propertyComponent;
    }
}

@Injectable({
    providedIn: 'root'
})
export class CmsPropertyRenderFactoryResolver {
    constructor(
        @Inject(DEFAULT_PROPERTY_RENDERS) private defaultPropertyRenderFactories: CmsPropertyRenderFactory[],
        @Optional() @Inject(PROPERTY_RENDERS) private propertyRenderFactories?: CmsPropertyRenderFactory[]) { }

    resolvePropertyRenderFactory(uiHint: string): CmsPropertyRenderFactory {
        let lastIndex = -1;
        if (this.propertyRenderFactories) {
            lastIndex = this.propertyRenderFactories.map(x => x.isMatching(uiHint)).lastIndexOf(true);
            if (lastIndex !== -1) { return this.propertyRenderFactories[lastIndex]; }
        }

        lastIndex = this.defaultPropertyRenderFactories.map(x => x.isMatching(uiHint)).lastIndexOf(true);
        if (lastIndex === -1) {
            // tslint:disable-next-line: max-line-length
            console.warn(`The CMS can not resolve the Property Render Factor for the property with UIHint of ${uiHint}. The default Text Render will be returned`);
            lastIndex = this.defaultPropertyRenderFactories.map(x => x.isMatching(UIHint.Text)).lastIndexOf(true);
            return this.defaultPropertyRenderFactories[lastIndex];
        }

        return this.defaultPropertyRenderFactories[lastIndex];
    }
}
