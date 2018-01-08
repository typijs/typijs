import { Router } from '@angular/router';
import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { BaseComponent } from '@angular-cms/core';

import { Blog } from './../register';
import { TestInjectService } from './test.service';

@Component({
    template: `
    <div id="about">
        <div class="header">
            <div class="footer">
                <div class="body">
                    <h2>{{currentContent.title}}</h2>
                    <div [innerHTML] ="currentContent.summary"></div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class BlogComponent extends BaseComponent<Blog> {

    constructor( @Inject(TestInjectService) private testService: TestInjectService, @Inject(Router) private router: Router) {
        super();
    }

    test() {
        this.testService.log()
        this.router.navigate(["/new-page-12/new-page-1"]);
    }


}