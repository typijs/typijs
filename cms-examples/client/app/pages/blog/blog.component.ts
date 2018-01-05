import { Router } from '@angular/router';
import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { BaseComponent } from '@angular-cms/core';

import { Blog } from './../register';
import { TestInjectService } from './test.service';

@Component({
    selector: 'blog',
    template: `
    <div id="about">
        <div class="header">
            <div class="footer">
                <div class="body">
                    <h2>{{currentContent.title}}</h2>
                   {{currentContent.summary}}
                    <h2>Be Part of Our Community</h2>
                    <p>
                        If you're experiencing issues and concerns about this website template, join the discussion <a href="http://www.freewebsitetemplates.com/forums/">on our forum</a> and meet other people in the community who share the same interests with you.
                    </p>
                    <h2>Template details</h2>
                    <p>
                        Design version 2<br>Code version 2<br> Website Template details, discussion and updates for this <a href="http://www.freewebsitetemplates.com/discuss/sushihanii/">Sushi Website Template</a>.<br> Website Template design by <a href="http://www.freewebsitetemplates.com/">Free Website Templates</a>.<br> Please feel free to remove some or all the text and links of this page and replace it with your own About content.
                    </p>
                    <br><br><br><br>
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