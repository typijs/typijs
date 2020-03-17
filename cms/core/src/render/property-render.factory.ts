import { Injectable, ComponentFactoryResolver, ComponentRef, InjectionToken, Injector, Inject } from '@angular/core';

import { CMS } from '../cms';
import { CmsPropertyRender } from '../bases/cms-property';
import { ContentTypeProperty, ClassOf } from '../constants/types';

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_PROVIDERS_RENDER_TOKEN: InjectionToken<CmsPropertyRenderFactory[]> = new InjectionToken<CmsPropertyRenderFactory[]>('PROPERTY_PROVIDERS_RENDER_TOKEN');

export function getCmsPropertyRenderFactory(propertyUIHint: string) {
    return (injector: Injector): CmsPropertyRenderFactory => {
        return new CmsPropertyRenderFactory(propertyUIHint, injector)
    };
};

@Injectable()
export class CmsPropertyRenderFactory {
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

    createPropertyComponent(property: ContentTypeProperty, propertyValue: any): ComponentRef<any> {
        return this.createDefaultCmsPropertyComponent(property, propertyValue);
    }

    protected getRegisteredPropertyRenderComponent(): ClassOf<CmsPropertyRender> {
        if (!CMS.PROPERTY_RENDERS[this.propertyUIHint])
            throw new Error(`The CMS don't have the property with UIHint of ${this.propertyUIHint}`);

        return CMS.PROPERTY_RENDERS[this.propertyUIHint];
    }

    protected createDefaultCmsPropertyComponent(property: ContentTypeProperty, propertyValue: any): ComponentRef<any> {
        const propertyComponentClass = this.getRegisteredPropertyRenderComponent();

        const propertyFactory = this.componentFactoryResolver.resolveComponentFactory(propertyComponentClass);

        const propertyComponent = propertyFactory.create(this.injector);

        (<CmsPropertyRender>propertyComponent.instance).property = property;
        (<CmsPropertyRender>propertyComponent.instance).value = propertyValue;

        return propertyComponent;
    }
}

@Injectable()
export class CmsPropertyRenderFactoryResolver {
    constructor(@Inject(PROPERTY_PROVIDERS_RENDER_TOKEN) private propertyRenderFactories: CmsPropertyRenderFactory[]) { }

    resolvePropertyRenderFactory(uiHint: string): CmsPropertyRenderFactory {
        const propertyRenderFactory = this.propertyRenderFactories.find(x => x.isMatching(uiHint));
        if (!propertyRenderFactory)
            throw new Error(`The CMS can not resolve the Property Render Factor for the property with UIHint of ${uiHint}`);

        return propertyRenderFactory;
    }
}