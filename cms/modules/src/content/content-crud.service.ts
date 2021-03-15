import { Content, TypeOfContent, ContentTypeProperty, Page, Block, Media, ContentType } from '@angular-cms/core';
import { InjectionToken, Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

export type ContentExt = Content & { urlSegment?: string, linkUrl?: string, visibleInMenu?: boolean, simpleAddress?: string };

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
    /**
     * Get content version detail. If the version Id is not provided, the primary version will be used
     * @param contentId the content id
     * @param versionId (Optional) the content version id. If the version Id is not provided, the primary version will be used
     * @param language (Optional) if the language is not provided, the default language will be used
     */
    abstract getContentVersion(contentId: string, versionId?: string, language?: string): Observable<ContentInfo>;
    abstract createContent(content: Partial<Content>, language?: string): Observable<Content>;
    abstract editContentVersion(contentId: string, versionId: string, content: Partial<Content>): Observable<Content>;
    abstract publishContentVersion(contentId: string, versionId: string): Observable<Content>;
}

@Injectable()
export class ContentCrudServiceResolver {
    constructor(@Inject(CONTENT_CRUD_SERVICES) private contentFormServices: ContentCrudService[]) { }

    resolveCrudFormService(typeOfContent: string): ContentCrudService {
        return this.contentFormServices.find(x => x.isMatching(typeOfContent));
    }
}
