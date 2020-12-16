import { ComponentFactoryResolver, ComponentRef, Inject, Injectable, InjectionToken, Injector, ViewContainerRef } from '@angular/core';
import { CmsComponent } from '../bases/cms-component';
import { ContentTypeService } from '../services/content-type.service';
import { BlockData, ContentData, PageData } from '../services/content/models/content-data';
import { Content } from '../services/content/models/content.model';
import { TypeOfContent, TypeOfContentEnum } from '../types';
import { ContentType, ContentTypeProperty } from '../types/content-type';
import { CmsPropertyRenderFactoryResolver } from './property-render.factory';


// https://stackoverflow.com/questions/51824125/injection-of-multiple-instances-in-angular
// tslint:disable-next-line: max-line-length
export const CONTENT_RENDERS: InjectionToken<CmsContentRenderFactory[]> = new InjectionToken<CmsContentRenderFactory[]>('CONTENT_RENDERS');

export abstract class CmsContentRenderFactory {
    protected componentFactoryResolver: ComponentFactoryResolver;
    protected propertyRenderFactoryResolver: CmsPropertyRenderFactoryResolver;

    constructor(protected injector: Injector, protected typeOfContent: TypeOfContent) {
        this.componentFactoryResolver = injector.get(ComponentFactoryResolver);
        this.propertyRenderFactoryResolver = injector.get(CmsPropertyRenderFactoryResolver);
    }

    isMatching(typeOfContent: TypeOfContent): boolean {
        return this.typeOfContent == typeOfContent;
    }

    createContentComponent(content: Content, viewContainerRef: ViewContainerRef): ComponentRef<any> {
        const contentType = this.getContentType(content);
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(contentType.metadata.componentRef);
        contentType.properties.forEach(property => this.populateReferenceProperty(content, property));

        const contentComponent = viewContainerRef.createComponent(componentFactory);
        (<CmsComponent<ContentData>>contentComponent.instance).currentContent = this.getContentData(content);
        return contentComponent;
    }

    protected abstract getContentType(content: Content): ContentType;

    protected abstract getContentData(content: Content): ContentData;

    protected populateReferenceProperty(content: Content, property: ContentTypeProperty): void {
        if (!content.properties) { return; }

        const fieldType = property.metadata.displayType;
        const propertyFactory = this.propertyRenderFactoryResolver.resolvePropertyRenderFactory(fieldType);
        content.properties[property.name] = propertyFactory.getPopulatedReferenceProperty(content, property);
    }
}
@Injectable()
export class PageRenderFactory extends CmsContentRenderFactory {

    constructor(protected injector: Injector, private contentTypeService: ContentTypeService) {
        super(injector, TypeOfContentEnum.Page);
    }
    protected getContentType(content: Content): ContentType {
        return this.contentTypeService.getPageType(content.contentType);
    }
    protected getContentData(content: Content): ContentData {
        return new PageData(content);
    }

}

@Injectable()
export class PagePartialRenderFactory extends CmsContentRenderFactory {

    constructor(protected injector: Injector, private contentTypeService: ContentTypeService) {
        super(injector, TypeOfContentEnum.PagePartial);
    }
    protected getContentType(content: Content): ContentType {
        return this.contentTypeService.getPageType(content.contentType);
    }
    protected getContentData(content: Content): ContentData {
        return new PageData(content);
    }

    createContentComponent(content: Content, viewContainerRef: ViewContainerRef): ComponentRef<any> {
        const contentType = this.getContentType(content);
        if (!contentType.metadata.partialComponentRef) throw new Error(`The ${contentType.name} page type must defined the partialComponentRef to render in Content Area`);

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(contentType.metadata.partialComponentRef);
        contentType.properties.forEach(property => this.populateReferenceProperty(content, property));

        const contentComponent = viewContainerRef.createComponent(componentFactory);
        (<CmsComponent<ContentData>>contentComponent.instance).currentContent = this.getContentData(content);
        return contentComponent;
    }
}

@Injectable()
export class BlockRenderFactory extends CmsContentRenderFactory {

    constructor(protected injector: Injector, private contentTypeService: ContentTypeService) {
        super(injector, TypeOfContentEnum.Block);
    }
    protected getContentType(content: Content): ContentType {
        return this.contentTypeService.getBlockType(content.contentType);
    }
    protected getContentData(content: Content): ContentData {
        return new BlockData(content);
    }

}
@Injectable()
export class MediaRenderFactory extends CmsContentRenderFactory {

    constructor(protected injector: Injector, private contentTypeService: ContentTypeService) {
        super(injector, TypeOfContentEnum.Media);
    }
    protected getContentType(content: Content): ContentType {
        return this.contentTypeService.getMediaType(content.contentType);
    }
    protected getContentData(content: Content): ContentData {
        return new BlockData(content);
    }
}

@Injectable({
    providedIn: 'root'
})
export class CmsContentRenderFactoryResolver {
    constructor(@Inject(CONTENT_RENDERS) private contentRenderFactories: CmsContentRenderFactory[]) { }

    resolveContentRenderFactory(typeOfContent: TypeOfContent): CmsContentRenderFactory {
        let lastIndex = -1;

        lastIndex = this.contentRenderFactories.map(x => x.isMatching(typeOfContent)).lastIndexOf(true);
        if (lastIndex !== -1) { return this.contentRenderFactories[lastIndex]; }
        throw new Error(`The CMS can not resolve the Content Render Factory for the content has type of ${typeOfContent}`);
    }
}
