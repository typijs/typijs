import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment, Params } from '@angular/router';

import {
    BLOCK_TYPE, PAGE_TYPE, slugify,
    ContentType, ContentTypeService,
    Block, BlockService,
    Page, PageService,
} from '@angular-cms/core';

import { SubjectService } from '../../shared/services/subject.service';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';


@Component({
    templateUrl: './content-type-list.component.html',
    styleUrls: ['./content-type-list.scss']
})
export class ContentTypeListComponent extends SubscriptionDestroy implements OnDestroy {
    contentName: string;
    contentTypes: ContentType[] = [];
    private typeOfContent: string;
    private parentId: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageService: PageService,
        private blockService: BlockService,
        private subjectService: SubjectService,
        private contentTypeService: ContentTypeService
    ) { super() }

    ngOnInit() {
        this.subscriptions.push(this.route.params.subscribe((params: Params) => {
            this.parentId = params['parentId'] || undefined;
            this.typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url)

            switch (this.typeOfContent) {
                case PAGE_TYPE:
                    this.contentName = "New Page";
                    this.contentTypes = this.contentTypeService.getAllPageTypes();
                    break;
                case BLOCK_TYPE:
                    this.contentName = "New Block";
                    this.contentTypes = this.contentTypeService.getAllBlockTypes();
                    break;
            }
        }));
    }

    private getTypeContentFromUrl(url: UrlSegment[]) {
        return url.length >= 2 && url[0].path == 'new' ? url[1].path : '';
    }

    createNewContent(contentType: ContentType) {
        if (this.contentName) {
            const content: any = {
                name: this.contentName,
                contentType: contentType.name,
                parentId: this.parentId,
                //TODO: should move generate the url segment to back-end
                urlSegment: slugify(this.contentName)
            }

            switch (this.typeOfContent) {
                case PAGE_TYPE:
                    this.createNewPage(content);
                    break;
                case BLOCK_TYPE:
                    this.createNewBlock(content);
                    break;
            }
        }
    }

    private createNewPage(content: Partial<Page>) {
        this.pageService.createContent(content).subscribe(
            (createdPage: Page) => {
                this.subjectService.firePageCreated(createdPage);
                //this.router.navigate(["/cms/editor/content/", PAGE_TYPE, res._id])
            },
            error => console.log(error)
        )
    }

    private createNewBlock(content: Partial<Block>) {
        this.blockService.createContent(content).subscribe(
            (createdBlock: Block) => {
                this.subjectService.fireBlockCreated(createdBlock);
                this.router.navigate(["/cms/editor/content/", BLOCK_TYPE, createdBlock._id])
            },
            error => console.log(error)
        )
    }
}