import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, InjectionToken, Injector } from '@angular/core';

import { CMS } from '../../../cms';
import { ClassOf } from '../../../types';
import { ContentTypeProperty } from '../../../types/content-type';
import { UIHint } from '../../../types/ui-hint';
import { ContentAreaRender } from '../content-area/content-area';
import { CmsPropertyRender, ImageRender, ObjectListRender, TextRender, UrlListRender, UrlRender, XHtmlRender } from "./property-render";

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_PROVIDERS_RENDER_TOKEN: InjectionToken<CmsPropertyRenderFactory[]> = new InjectionToken<CmsPropertyRenderFactory[]>('PROPERTY_PROVIDERS_RENDER_TOKEN');

export function getCmsPropertyRenderFactory(propertyUIHint: string) {
    return function cmsPropertyRenderFactory(injector: Injector): CmsPropertyRenderFactory {
        return new CmsPropertyRenderFactory(propertyUIHint, injector)
    };
};

export function contentAreaRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.ContentArea] = ContentAreaRender;
    return new CmsPropertyRenderFactory(UIHint.ContentArea, injector)
};

export function textRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.Text] = TextRender;
    return new CmsPropertyRenderFactory(UIHint.Text, injector)
};

export function textareaRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.Textarea] = TextRender;
    return new CmsPropertyRenderFactory(UIHint.Textarea, injector)
};

export function xhtmlRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.XHtml] = XHtmlRender;
    return new CmsPropertyRenderFactory(UIHint.XHtml, injector)
};

export function imageRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.Image] = ImageRender;
    return new CmsPropertyRenderFactory(UIHint.Image, injector)
};

export function urlRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.Url] = UrlRender;
    return new CmsPropertyRenderFactory(UIHint.Url, injector)
};

export function urlListRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.UrlList] = UrlListRender;
    return new CmsPropertyRenderFactory(UIHint.UrlList, injector)
};

export function objectListRenderFactory(injector: Injector): CmsPropertyRenderFactory {
    CMS.PROPERTY_RENDERS[UIHint.ObjectList] = ObjectListRender;
    return new CmsPropertyRenderFactory(UIHint.ObjectList, injector)
};

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

@Injectable({
    providedIn: 'root'
})
export class CmsPropertyRenderFactoryResolver {
    constructor(@Inject(PROPERTY_PROVIDERS_RENDER_TOKEN) private propertyRenderFactories: CmsPropertyRenderFactory[]) { }

    resolvePropertyRenderFactory(uiHint: string): CmsPropertyRenderFactory {
        const propertyRenderFactory = this.propertyRenderFactories.find(x => x.isMatching(uiHint));
        if (!propertyRenderFactory)
            throw new Error(`The CMS can not resolve the Property Render Factor for the property with UIHint of ${uiHint}`);

        return propertyRenderFactory;
    }
}