import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';

import { ClassOf } from '../../../types';
import { ContentTypeProperty } from '../../../types/content-type';
import { UIHint } from '../../../types/ui-hint';
import { ContentAreaRender } from '../content-area/content-area';
import { CmsPropertyRender, ImageRender, ObjectListRender, TextRender, UrlListRender, UrlRender, XHtmlRender } from "./property-render";

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_RENDERS: InjectionToken<CmsPropertyRenderFactory[]> = new InjectionToken<CmsPropertyRenderFactory[]>('PROPERTY_RENDERS');
export const DEFAULT_PROPERTY_RENDERS: InjectionToken<CmsPropertyRenderFactory[]> = new InjectionToken<CmsPropertyRenderFactory[]>('DEFAULT_PROPERTY_RENDERS');

export class CmsPropertyRenderFactory {
    protected componentFactoryResolver: ComponentFactoryResolver;

    constructor(protected injector: Injector, protected propertyUIHint: string, protected propertyCtor: ClassOf<CmsPropertyRender>) {
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

        (<CmsPropertyRender>propertyComponent.instance).property = property;
        (<CmsPropertyRender>propertyComponent.instance).value = propertyValue;

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
            if (lastIndex != -1) return this.propertyRenderFactories[lastIndex];
        }

        lastIndex = this.defaultPropertyRenderFactories.map(x => x.isMatching(uiHint)).lastIndexOf(true);
        if (lastIndex == -1) throw new Error(`The CMS can not resolve the Property Render Factor for the property with UIHint of ${uiHint}`);

        return this.defaultPropertyRenderFactories[lastIndex];;
    }
}

@Injectable()
export class ContentAreaRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.ContentArea, ContentAreaRender);
    }
}

@Injectable()
export class TextRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Text, TextRender);
    }
}

@Injectable()
export class TextareaRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Textarea, TextRender);
    }
}

@Injectable()
export class XHtmlRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.XHtml, XHtmlRender);
    }
}

@Injectable()
export class ImageRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Image, ImageRender);
    }
}

@Injectable()
export class UrlRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Url, UrlRender);
    }
}

@Injectable()
export class UrlListRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.UrlList, UrlListRender);
    }
}

@Injectable()
export class ObjectListRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.ObjectList, ObjectListRender);
    }
}