import { Content, TypeOfContent, ContentTypeProperty, Page, Block, Media, ContentType } from '@angular-cms/core';
import { InjectionToken, Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

export type ContentInfo = {
    contentTypeProperties: ContentTypeProperty[],
    contentData: Page | Block | Media,
    previewUrl: string
};

export const CONTENT_CRUD_SERVICES: InjectionToken<ContentCrudService[]> = new InjectionToken<ContentCrudService[]>('CONTENT_CRUD_SERVICES');

export abstract class ContentCrudService {
    constructor(public typeOfContent: TypeOfContent) { }
    isMatching(typeOfContent: TypeOfContent): boolean {
        return this.typeOfContent === typeOfContent;
    }
    abstract getAllContentTypes(): ContentType[];
    abstract getContent(contentId: string, versionId: string, language: string, host: string): Observable<ContentInfo>;
    abstract createContent(content: Content): Observable<Content>;
    abstract editContent(content: Content): Observable<Content>;
    abstract publishContent(contentId: string, versionId: string): Observable<Content>;
}

@Injectable()
export class ContentCrudServiceResolver {
    constructor(@Inject(CONTENT_CRUD_SERVICES) private contentFormServices: ContentCrudService[]) { }

    resolveCrudFormService(typeOfContent: string): ContentCrudService {
        return this.contentFormServices.find(x => x.isMatching(typeOfContent));
    }
}
