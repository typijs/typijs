import { ContentTypeService, ngEditMode, ngId, Page, PageService, ContentTypeEnum, ContentType } from '@typijs/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContentCrudService, ContentInfo } from '../content/content-crud.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class PageCrudService extends ContentCrudService {
    constructor(
        private contentTypeService: ContentTypeService,
        private pageService: PageService,
        private subjectService: SubjectService) {
        super(ContentTypeEnum.Page);
    }

    getContentVersion(contentId: string, versionId: string, language: string): Observable<ContentInfo> {
        return this.pageService.getContentVersion(contentId, versionId, language)
            .pipe(
                // fire page selected event to inform to page tree locate to right node
                tap(contentData => this.subjectService.firePageSelected(contentData)),
                map(contentData => ({
                    contentTypeProperties: this.contentTypeService.getPageTypeProperties(contentData.contentType),
                    previewUrl: this.getPublishedUrlOfContent(contentData),
                    contentData
                }))
            );
    }

    createContent(content: Partial<Page>, language?: string): Observable<Page> {
        return this.pageService.createContent(content, language).pipe(
            tap(createdPage => this.subjectService.firePageCreated(createdPage))
        );
    }

    editContentVersion(contentId: string, versionId: string, content: Partial<Page>): Observable<Page> {
        return this.pageService.editContentVersion(contentId, versionId, content);
    }

    publishContentVersion(contentId: string, versionId: string): Observable<Page> {
        return this.pageService.publishContentVersion(contentId, versionId);
    }

    getAllContentTypes(): ContentType[] {
        return this.contentTypeService.getAllPageTypes();
    }

    private getPublishedUrlOfContent(contentData: Page): string {
        return `http://localhost:4200${contentData.linkUrl}?${ngEditMode}=True&${ngId}=${contentData._id}`;
    }
}
