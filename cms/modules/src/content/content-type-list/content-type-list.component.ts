import { ContentType } from '@angular-cms/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';
import { ContentFormService, ContentFormServiceResolver } from '../content-form.service';

@Component({
    templateUrl: './content-type-list.component.html',
    styleUrls: ['./content-type-list.scss']
})
export class ContentTypeListComponent extends SubscriptionDestroy implements OnInit, OnDestroy {
    contentName: string;
    contentTypes: ContentType[] = [];
    private contentService: ContentFormService;
    private parentId: string;

    constructor(
        private route: ActivatedRoute,
        private contentServiceResolver: ContentFormServiceResolver
    ) { super(); }

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    this.parentId = params.parentId || undefined;

                    const typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url);
                    this.contentName = `New ${typeOfContent}`;
                    this.contentService = this.contentServiceResolver.resolveContentFormService(typeOfContent);
                    this.contentTypes = this.contentService.getAllContentTypes();
                    return this.contentTypes;
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();
    }

    createNewContent(contentType: ContentType) {
        if (this.contentName) {
            const content: any = {
                name: this.contentName,
                contentType: contentType.name,
                parentId: this.parentId
            };

            this.contentService.createContent(content).subscribe();
        }
    }

    private getTypeContentFromUrl(url: UrlSegment[]): string {
        return url.length >= 2 && url[0].path === 'new' ? url[1].path : '';
    }
}
