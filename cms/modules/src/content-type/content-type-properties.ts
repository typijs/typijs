import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ContentPropertyModel } from './content-property.model';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { ContentTypeService, TypeOfContent, ContentType, ContentTypeProperty } from '@angular-cms/core';
import { Observable, of } from 'rxjs';

@Component({
    template: `
    <div class="p-2 row" *ngIf="contentType$ |async as contentType">
        <h5 class="col-12">{{contentType.name}}</h5>
        <div class="col-4">Name</div>
        <div class="col-8">{{contentType.name}}</div>
        <div class="col-4">Display Name</div>
        <div class="col-8">{{contentType.metadata.displayName}}</div>
        <div class="col-4">Description</div>
        <div class="col-8">{{contentType.metadata.description}}</div>
        <div class="mt-4 col-12">
            <cms-table [modelType]="modelType" [rows]="contentType.properties |map: mapToModel"></cms-table>
        </div>
    </div>
  `
})
export class ContentTypePropertiesComponent extends SubscriptionDestroy implements OnInit {
    modelType: new () => ContentPropertyModel = ContentPropertyModel;

    contentType$: Observable<ContentType>;
    constructor(private route: ActivatedRoute, private contentTypeService: ContentTypeService) { super(); }

    ngOnInit() {
        this.contentType$ = this.route.params
            .pipe(
                switchMap((params: Params) => {
                    const typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url);
                    switch (typeOfContent) {
                        case 'page':
                            return of(this.contentTypeService.getPageType(params.name));
                        case 'block':
                            return of(this.contentTypeService.getBlockType(params.name));
                        case 'media':
                            return of(this.contentTypeService.getMediaType(params.name));
                    }
                    return of(undefined);
                }),
                takeUntil(this.unsubscribe$)
            );
    }

    mapToModel(property: ContentTypeProperty): ContentPropertyModel {
        return { name: property.name, propertyType: property.metadata._propertyType, ...property.metadata };
    }

    private getTypeContentFromUrl(url: UrlSegment[]): TypeOfContent {
        return url.length >= 2 && url[0].path === 'content-type' ? url[1].path : '';
    }
}
