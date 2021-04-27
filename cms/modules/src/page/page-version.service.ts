import { Content, PageService, ContentTypeEnum } from '@typijs/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentVersionService } from '../content-version/content-version.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class PageVersionService extends ContentVersionService {

    constructor(
        private pageService: PageService,
        private subjectService: SubjectService) {
        super(ContentTypeEnum.Page);
    }

    getAllVersions(contentId: string): Observable<Content[]> {
        return this.pageService.getAllVersionsOfContent(contentId);
    }
    createNewVersion(masterVersionId: string): Observable<Content> {
        throw new Error('Method not implemented.');
    }
    setVersionIsPrimary(versionId: string): Observable<Content> {
        return this.pageService.setPrimaryVersion(versionId);
    }
    deleteVersion(versionId: string): Observable<Content> {
        throw new Error('Method not implemented.');
    }
}
