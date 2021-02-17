import { Inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { groupBy } from '../../helpers/common';
import { ClassOf, TypeOfContent } from '../../types';
import { ContentReference } from '../../types/content-reference';
import { ContentService } from './content.service';
import { ContentData } from './models/content-data';
import { Content } from './models/content.model';

/**
 * The loader options for `ContentLoader`
 *
 * @member contentType name of Content Type or class of Content Type such as 'ArticlePage' or `ArticlePage`
 * @member language the language of content, if not provided the default language will be used
 * @member pageNumber the page number
 * @member pageSize the page size
 */
export type LoaderOptions = {
    /**
     * name of Content Type or class of Content Type such as `'ArticlePage'` or `ArticlePage`
     */
    contentType?: string | ClassOf<any>;
    /**
     * the language of content, if not provided the default language will be used
     */
    language?: string;
    /**
     * the page number
     */
    pageNumber?: number;
    /**
     * the page size
     */
    pageSize?: number
};

export const CONTENT_SERVICE_PROVIDER: InjectionToken<ContentService<Content>[]> = new InjectionToken<ContentService<Content>[]>('CONTENT_SERVICE_PROVIDER');

@Injectable({ providedIn: 'root' })
export class ContentLoader {
    constructor(private contentServiceResolver: ContentServiceResolver) { }

    get<T extends ContentData>(contentLink: ContentReference, language?: string): Observable<T> {
        const contentService = this.contentServiceResolver.resolveContentProviderFactory(contentLink.type);
        return contentService.getContent(contentLink.id, language).pipe(
            map((content: Content) => contentService.getContentData(content))
        );
    }

    getChildren<T extends ContentData>(contentLink: ContentReference, loaderOptions?: LoaderOptions): Observable<T[]> {
        const contentService = this.contentServiceResolver.resolveContentProviderFactory(contentLink.type);
        return contentService.getContentChildren(contentLink.id).pipe(
            map((children: Content[]) => children.map(childContent => contentService.getContentData(childContent)))
        );
    }

    getDescendents(contentLink: ContentReference, loaderOptions?: LoaderOptions): Observable<ContentReference[]> {
        throw new Error('Not implemented');
    }

    getAncestors(contentLink: ContentReference, loaderOptions?: LoaderOptions): Observable<ContentData[]> {
        throw new Error('Not implemented');
    }

    getItems(contentLinks: ContentReference[], loaderOptions?: LoaderOptions): Observable<Content[]> {

        const contentLinksGroup = groupBy(contentLinks, 'type');
        const getContentItemsArray: Observable<Content[]>[] = [];
        Object.keys(contentLinksGroup).forEach(key => {
            const contentService = this.contentServiceResolver.resolveContentProviderFactory(key);
            const contentIds = contentLinksGroup[key].map(x => x._id);
            if (contentService && contentIds && contentIds.length > 0) {
                getContentItemsArray.push(
                    contentService.getContentItems(contentIds).pipe(catchError(() => []))
                );
            }
        });

        return forkJoin(...getContentItemsArray).pipe(
            map((contentsResult: Content[][]) => {
                let result: Content[] = [];
                contentsResult.forEach(contents => result = result.concat(contents));
                return result;
            })
        );
    }
}

@Injectable({
    providedIn: 'root'
})
export class ContentServiceResolver {
    constructor(@Inject(CONTENT_SERVICE_PROVIDER) private contentServices: ContentService<Content>[]) { }

    resolveContentProviderFactory(typeOfContent: TypeOfContent): ContentService<Content> {

        const resolvedService = this.contentServices.find(x => x.isMatching(typeOfContent));
        if (resolvedService) { return resolvedService; }

        throw new Error(`The CMS can not resolve the Content Service for the content has type of ${typeOfContent}`);
    }
}
