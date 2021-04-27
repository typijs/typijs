import { BlockService, ContentTypeEnum, Content } from '@typijs/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentVersionService } from '../content-version/content-version.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class BlockVersionService extends ContentVersionService {

    constructor(
        private blockService: BlockService,
        private subjectService: SubjectService) {
        super(ContentTypeEnum.Block);
    }

    getAllVersions(contentId: string): Observable<Content[]> {
        return this.blockService.getAllVersionsOfContent(contentId);
    }
    createNewVersion(masterVersionId: string): Observable<Content> {
        throw new Error('Method not implemented.');
    }
    setVersionIsPrimary(versionId: string): Observable<Content> {
        return this.blockService.setPrimaryVersion(versionId);
    }
    deleteVersion(versionId: string): Observable<Content> {
        throw new Error('Method not implemented.');
    }
}
