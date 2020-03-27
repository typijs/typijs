import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
    PAGE_TYPE, BLOCK_TYPE,
    InsertPointDirective
} from '@angular-cms/core';

import { SubscriptionDestroy } from '../shared/subscription-destroy';

@Component({
    selector: 'preview',
    template: `<ng-template cmsInsertPoint></ng-template>`
})

export class PreviewComponent extends SubscriptionDestroy implements OnInit {
    @ViewChild(InsertPointDirective, { static: true, read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

    constructor(private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        //Subscription the route change
        this.subscriptions.push(this.route.params.subscribe(params => {
            const typeOfContent = this.getTypeContentFromUrl(this.route.snapshot.url)
            switch (typeOfContent) {
                case PAGE_TYPE:
                    //Create Layout component
                    break;
                case BLOCK_TYPE:
                    //Create Empty component
                    break;
            }


        }));
    }

    private getTypeContentFromUrl(url: UrlSegment[]) {
        return url.length >= 2 && url[0].path == 'preview' ? url[1].path : '';
    }
}