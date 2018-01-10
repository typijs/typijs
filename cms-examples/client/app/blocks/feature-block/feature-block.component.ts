import { Router } from '@angular/router';
import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { BaseComponent } from '@angular-cms/core';
import { FeatureBlock } from './feature-block.blocktype';

@Component({
    template: `
    <div class="frame">
        <img src="assets/images/sushi10.png" alt="Img" height="192" width="189"/>
        <h2>{{currentContent.title}}</h2>
        <div [innerHtml]="currentContent.summary"></div>
        <a href="blog.html" class="more">{{currentContent.linkText}}</a>
    </div>
  `
})
export class FeatureBlockComponent extends BaseComponent<FeatureBlock> {

    constructor(@Inject(Router) private router: Router) {
        super();
    }

    test() {
        this.router.navigate(["/new-page-12/new-page-1"]);
    }
}