import { Component, OnInit } from '@angular/core';
import { ContentTypeService, ContentType } from '@angular-cms/core';

@Component({
    template: `
        <div>
            <h5>Page Types</h5>
            <ul *ngIf="pageTypes">
                <li *ngFor="let pageType of pageTypes" [routerLink]="['content-type/page', pageType.name]">{{pageType.metadata.displayName}}</li>
            </ul>
            <h5>Block Types</h5>
            <ul *ngIf="blockTypes">
                <li *ngFor="let blockType of blockTypes" [routerLink]="['content-type/block', blockType.name]">{{blockType.metadata.displayName}}</li>
            </ul>
            <h5>Media Types</h5>
            <ul *ngIf="mediaTypes">
                <li *ngFor="let mediaType of mediaTypes" [routerLink]="['content-type/media', mediaType.name]">{{mediaType.name}}</li>
            </ul>
        </div>
    `
})
export class ContentTypeListComponent implements OnInit {
    pageTypes: ContentType[];
    blockTypes: ContentType[];
    mediaTypes: ContentType[];

    constructor(private contentTypeService: ContentTypeService) { }

    ngOnInit() {
        this.pageTypes = this.contentTypeService.getAllPageTypes();
        this.blockTypes = this.contentTypeService.getAllBlockTypes();
        this.mediaTypes = this.contentTypeService.getAllMediaTypes();
    }
}
