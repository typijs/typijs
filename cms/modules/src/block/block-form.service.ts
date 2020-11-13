import { Block, BlockService, BLOCK_TYPE, ContentTypeService, ContentType, Content } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ContentFormService, ContentInfo } from '../content/content-form.service';
import { SubjectService } from '../shared/services/subject.service';

@Injectable()
export class BlockFormService extends ContentFormService {
    constructor(
        private router: Router,
        private contentTypeService: ContentTypeService,
        private blockService: BlockService,
        private subjectService: SubjectService) {
        super(BLOCK_TYPE);
    }

    getContent(contentId: string): Observable<ContentInfo> {
        return this.blockService.getContent(contentId)
            .pipe(
                map(contentData => ({
                    contentTypeProperties: this.contentTypeService.getBlockTypeProperties(contentData.contentType),
                    previewUrl: '',
                    contentData
                }))
            );
    }

    createContent(content: Block): Observable<Block> {
        return this.blockService.createContent(content).pipe(
            tap(createdBlock => {
                this.subjectService.fireBlockCreated(createdBlock);
                this.router.navigate(['/cms/editor/content/', BLOCK_TYPE, createdBlock._id]);
            })
        );
    }

    editContent(content: Block): Observable<Block> {
        return this.blockService.editContent(content);
    }

    publishContent(contentId: string): Observable<Content> {
        return this.blockService.publishContent(contentId);
    }

    getAllContentTypes(): ContentType[] {
        return this.contentTypeService.getAllBlockTypes();
    }
}
