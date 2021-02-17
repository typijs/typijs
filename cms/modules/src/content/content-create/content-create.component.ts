import { ContentType, TypeOfContent, LanguageService, sortByNumber, comparison } from '@angular-cms/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';
import { ContentCrudService, ContentCrudServiceResolver } from '../content-crud.service';

export type ContentTypeGroup = {
    groupName: string;
    order: number;
    contentTypes: ContentType[]
}

@Component({
    templateUrl: './content-create.component.html',
    styleUrls: ['./content-create.scss']
})
export class ContentCreateComponent extends SubscriptionDestroy implements OnInit, OnDestroy {

    contentName: string;
    typeOfContent: string;
    contentTypeGroups: ContentTypeGroup[] = [];
    private contentService: ContentCrudService;
    private parentId: string;
    private hasHistory: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private languageService: LanguageService,
        private contentServiceResolver: ContentCrudServiceResolver
    ) { super(); }

    ngOnInit() {
        this.hasHistory = this.router.navigated;
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    this.parentId = params.parentId || undefined;

                    this.typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url);
                    this.contentName = `New ${this.typeOfContent}`;
                    this.contentService = this.contentServiceResolver.resolveCrudFormService(this.typeOfContent);
                    const contentTypes = this.contentService.getAllContentTypes();
                    this.contentTypeGroups = this.extractContentTypeGroups(contentTypes);
                    return this.contentTypeGroups;
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

    onCancel() {
        if (this.hasHistory) {
            this.location.back();
        } else {
            // Go to default start page
        }
    }

    private extractContentTypeGroups(allContentTypes: ContentType[]): ContentTypeGroup[] {
        const defaultGroupName = 'Other Content Types'
        const groups: ContentTypeGroup[] = [{
            groupName: defaultGroupName,
            order: 0,
            contentTypes: []
        }];

        allContentTypes.forEach(contentType => {
            if (!contentType.metadata.groupName) {
                groups[0].contentTypes.push(contentType);
            } else {
                let matchGroupIndex = groups.findIndex(x => x.groupName === contentType.metadata.groupName);
                if (matchGroupIndex != -1) {
                    groups[matchGroupIndex].contentTypes.push(contentType);
                    groups[matchGroupIndex].order += contentType.metadata.order ? contentType.metadata.order : 0;
                } else {
                    groups.push({
                        groupName: contentType.metadata.groupName,
                        contentTypes: [contentType],
                        order: contentType.metadata.order ? contentType.metadata.order : 0
                    })
                }
            }
        })

        groups.forEach(group => {
            group.contentTypes = group.contentTypes.sort(this.sortContentType);
        })

        return groups.sort(sortByNumber('order', 'asc'));
    }

    private sortContentType(cType1: ContentType, cType2: ContentType): number {
        let { order: order1, displayName: displayName1 } = cType1.metadata;
        let { order: order2, displayName: displayName2 } = cType2.metadata;
        let name1 = cType1.name;
        let name2 = cType2.name;

        if (!order1) { order1 = 0; }
        if (!order2) { order2 = 0; }
        if (!displayName1) { displayName1 = ''; }
        if (!displayName2) { displayName2 = ''; }

        if (order1 === order2) {
            if (displayName1 === displayName2) {
                return comparison(name1, name2);
            }
            return comparison(displayName1, displayName2);
        }
        return comparison(order1, order2);

    }

    private getTypeContentFromUrl(url: UrlSegment[]): TypeOfContent {
        return url.length >= 2 && url[0].path === 'new' ? url[1].path : '';
    }
}
