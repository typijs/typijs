import { BlockService, ContentVersion, BLOCK_TYPE } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentVersionService } from '../content-version/content-version.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class BlockVersionService extends ContentVersionService {

    constructor(
        private blockService: BlockService,
        private subjectService: SubjectService) {
        super(BLOCK_TYPE);
    }

    getAllVersions(contentId: string): Observable<ContentVersion[]> {
        return this.blockService.getContentVersions(contentId);
    }
    createNewVersion(masterVersionId: string): Observable<ContentVersion> {
        throw new Error('Method not implemented.');
    }
    setVersionIsPrimary(versionId: string): Observable<ContentVersion> {
        return this.blockService.setPrimaryVersion(versionId);
    }
    deleteVersion(versionId: string): Observable<ContentVersion> {
        throw new Error('Method not implemented.');
    }
}
