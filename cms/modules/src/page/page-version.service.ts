import { ContentVersion, PageService, PAGE_TYPE } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentVersionService } from '../content-version/content-version.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class PageVersionService extends ContentVersionService {

    constructor(
        private pageService: PageService,
        private subjectService: SubjectService) {
        super(PAGE_TYPE);
    }

    getAllVersions(contentId: string): Observable<ContentVersion[]> {
        return this.pageService.getContentVersions(contentId);
    }
    createNewVersion(masterVersionId: string): Observable<ContentVersion> {
        throw new Error('Method not implemented.');
    }
    setVersionIsPrimary(versionId: string): Observable<ContentVersion> {
        return this.pageService.setPrimaryVersion(versionId);
    }
    deleteVersion(versionId: string): Observable<ContentVersion> {
        throw new Error('Method not implemented.');
    }
}
