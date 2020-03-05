import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

import { Block, BlockService, BLOCK_TYPE_METADATA_KEY, CMS, Page, PageService, PAGE_TYPE_METADATA_KEY, slugify } from '@angular-cms/core';

import { SubjectService } from '../../shared/services/subject.service';
import { BLOCK_TYPE, PAGE_TYPE } from './../../constants';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';


@Component({
    templateUrl: './content-type-list.component.html',
})
export class ContentTypeListComponent extends SubscriptionDestroy implements OnDestroy {

    type: string;
    contentName: string;
    contentTypes: Array<any> = [];
    parentId: string;

    constructor(
        private pageService: PageService,
        private blockService: BlockService,
        private subjectService: SubjectService,
        private router: Router,
        private route: ActivatedRoute) { super() }

    ngOnInit() {
        this.subscriptions.push(this.route.params.subscribe(params => {
            this.parentId = params['parentId'] || undefined;
            const url: UrlSegment[] = this.route.snapshot.url;
            this.type = url.length >= 2 && url[0].path == 'new' ? url[1].path : '';

            switch (this.type) {
                case PAGE_TYPE:
                    this.contentName = "New Page";
                    this.getAllPageTypes();
                    break;
                case BLOCK_TYPE:
                    this.contentName = "New Block";
                    this.getAllBlockTypes();
                    break;
            }
        }));
    }

    createNewContent(contentType) {
        if (this.contentName) {
            let content: any = {
                name: this.contentName,
                contentType: contentType.typeRef.name,
                parentId: this.parentId,
                //TODO: should move generate the url segment to back-end
                urlSegment: slugify(this.contentName)
            }

            switch (this.type) {
                case PAGE_TYPE:
                    this.savePage(content);
                    break;
                case BLOCK_TYPE:
                    this.saveBlock(content);
                    break;
            }
        }
    }

    private getAllPageTypes() {
        this.contentTypes = [];
        Object.keys(CMS.PAGE_TYPES).map(key => CMS.PAGE_TYPES[key]).forEach(pageType => {
            let pageTypeMetadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, pageType);

            this.contentTypes.push({
                typeRef: pageType,
                metadata: pageTypeMetadata,
            })
        });
    }

    private getAllBlockTypes() {
        this.contentTypes = [];
        Object.keys(CMS.BLOCK_TYPES).map(key => CMS.BLOCK_TYPES[key]).forEach(blockType => {
            let blockTypeMetadata = Reflect.getMetadata(BLOCK_TYPE_METADATA_KEY, blockType);

            this.contentTypes.push({
                typeRef: blockType,
                metadata: blockTypeMetadata,
            })
        });
    }

    private savePage(content: any) {
        this.pageService.createContent(content).subscribe(
            (createdPage: Page) => {
                this.subjectService.firePageCreated(createdPage);
                //this.router.navigate(["/cms/editor/content/", PAGE_TYPE, res._id])
            },
            error => console.log(error)
        )
    }

    private saveBlock(content: any) {
        this.blockService.createContent(content).subscribe(
            (createdBlock: Block) => {
                this.subjectService.fireBlockCreated(createdBlock);
                this.router.navigate(["/cms/editor/content/", BLOCK_TYPE, createdBlock._id])
            },
            error => console.log(error)
        )
    }
}