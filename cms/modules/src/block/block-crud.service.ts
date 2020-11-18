import { Block, BlockService, BLOCK_TYPE, ContentTypeService, ContentType, Content } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContentCrudService, ContentInfo } from '../content/content-crud.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class BlockCrudService extends ContentCrudService {
    constructor(
        private router: Router,
        private contentTypeService: ContentTypeService,
        private blockService: BlockService,
        private subjectService: SubjectService) {
        super(BLOCK_TYPE);
    }

    getContentVersion(contentId: string, versionId: string, language: string, host: string): Observable<ContentInfo> {
        return this.blockService.getContentVersion(contentId, versionId, language, host)
            .pipe(
                map(contentData => ({
                    contentTypeProperties: this.contentTypeService.getBlockTypeProperties(contentData.contentType),
                    previewUrl: '',
                    contentData
                }))
            );
    }

    createContent(content: Partial<Block>, language?: string): Observable<Block> {
        return this.blockService.createContent(content, language).pipe(
            tap(createdBlock => {
                this.subjectService.fireBlockCreated(createdBlock);
                this.router.navigate(['/cms/editor/content/', BLOCK_TYPE, createdBlock._id]);
            })
        );
    }

    editContentVersion(contentId: string, versionId: string, content: Partial<Block>): Observable<Block> {
        return this.blockService.editContentVersion(contentId, versionId, content);
    }

    publishContentVersion(contentId: string, versionId: string): Observable<Content> {
        return this.blockService.publishContentVersion(contentId, versionId);
    }

    getAllContentTypes(): ContentType[] {
        return this.contentTypeService.getAllBlockTypes();
    }
}
