import { Block, BlockService, ContentTypeEnum, ContentTypeService, ContentType, Content, ADMIN_ROUTE } from '@typijs/core';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContentCrudService, ContentInfo } from '../content/content-crud.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class BlockCrudService extends ContentCrudService {
    constructor(
        @Inject(ADMIN_ROUTE) private adminPath: string,
        private router: Router,
        private contentTypeService: ContentTypeService,
        private blockService: BlockService,
        private subjectService: SubjectService) {
        super(ContentTypeEnum.Block);
    }

    getContentVersion(contentId: string, versionId: string, language: string): Observable<ContentInfo> {
        return this.blockService.getContentVersion(contentId, versionId, language)
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
                this.router.navigate([`${this.adminPath}/editor/content/`, ContentTypeEnum.Block, createdBlock._id]);
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
