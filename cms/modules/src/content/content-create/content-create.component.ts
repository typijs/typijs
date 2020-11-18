import { ContentType, TypeOfContent, LanguageService } from '@angular-cms/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';
import { ContentCrudService, ContentCrudServiceResolver } from '../content-crud.service';

@Component({
    templateUrl: './content-create.component.html',
    styleUrls: ['./content-create.scss']
})
export class ContentCreateComponent extends SubscriptionDestroy implements OnInit, OnDestroy {
    contentName: string;
    contentTypes: ContentType[] = [];
    private contentService: ContentCrudService;
    private parentId: string;

    constructor(
        private route: ActivatedRoute,
        private languageService: LanguageService,
        private contentServiceResolver: ContentCrudServiceResolver
    ) { super(); }

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    this.parentId = params.parentId || undefined;

                    const typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url);
                    this.contentName = `New ${typeOfContent}`;
                    this.contentService = this.contentServiceResolver.resolveCrudFormService(typeOfContent);
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
            const language = this.languageService.getLanguageParam();
            this.contentService.createContent(content, language).subscribe();
        }
    }

    private getTypeContentFromUrl(url: UrlSegment[]): TypeOfContent {
        return url.length >= 2 && url[0].path === 'new' ? url[1].path : '';
    }
}
