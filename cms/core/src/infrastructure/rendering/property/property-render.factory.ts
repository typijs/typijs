import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, InjectionToken, Injector } from '@angular/core';

import { ClassOf } from '../../../types';
import { ContentTypeProperty } from '../../../types/content-type';
import { UIHint } from '../../../types/ui-hint';
import { ContentAreaRender } from '../content-area/content-area';
import { CmsPropertyRender, ImageRender, ObjectListRender, TextRender, UrlListRender, UrlRender, XHtmlRender } from "./property-render";

// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
export const PROPERTY_RENDER: InjectionToken<CmsPropertyRenderFactory[]> = new InjectionToken<CmsPropertyRenderFactory[]>('PROPERTY_RENDER_PROVIDERS_TOKEN');

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
    constructor(@Inject(PROPERTY_RENDER) private propertyRenderFactories: CmsPropertyRenderFactory[]) { }

    resolvePropertyRenderFactory(uiHint: string): CmsPropertyRenderFactory {
        const propertyRenderFactory = this.propertyRenderFactories.find(x => x.isMatching(uiHint));
        if (!propertyRenderFactory)
            throw new Error(`The CMS can not resolve the Property Render Factor for the property with UIHint of ${uiHint}`);

        return propertyRenderFactory;
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