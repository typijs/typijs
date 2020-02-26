import { Component, OnInit } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { BlogPage } from './blog.pagetype';

@Component({
    templateUrl: 'blog.component.html'
})

export class BlogComponent extends CmsComponent<BlogPage> {
    constructor() {
        super();
    }
}