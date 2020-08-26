import { Content, TypeOfContent, ContentTypeProperty, Page, Block, Media, ContentType } from '@angular-cms/core';
import { InjectionToken, Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

export type ContentInfo = {
    contentTypeProperties: ContentTypeProperty[],
    contentData: Page | Block | Media,
    previewUrl: string
};

export const CONTENT_FORM_SERVICES: InjectionToken<ContentFormService[]> = new InjectionToken<ContentFormService[]>('CONTENT_FORM_SERVICES');

export abstract class ContentFormService {
    constructor(public typeOfContent: TypeOfContent) { }
    isMatching(typeOfContent: TypeOfContent): boolean {
        return this.typeOfContent === typeOfContent;
    }

    abstract getContent(contentId: string): Observable<ContentInfo>;
    abstract createContent(content: Content): Observable<Content>;
    abstract editContent(content: Content): Observable<Content>;
    abstract getAllContentTypes(): ContentType[];
}

@Injectable()
export class ContentFormServiceResolver {
    constructor(@Inject(CONTENT_FORM_SERVICES) private contentFormServices: ContentFormService[]) { }

    resolveContentFormService(typeOfContent: string): ContentFormService {
        return this.contentFormServices.find(x => x.isMatching(typeOfContent));
    }
}
