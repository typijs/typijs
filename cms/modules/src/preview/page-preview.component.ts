import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SubscriptionDestroy } from '../shared/subscription-destroy';


@Component({
    selector: 'page-preview',
    template: `     `
})

export class PagePreviewComponent extends SubscriptionDestroy implements OnInit {
    constructor(private route: ActivatedRoute) { super(); }

    ngOnInit() {
        this.subscriptions.push(this.route.params.subscribe(params => {
            const contentId = params['id'];


        }));
    }
}