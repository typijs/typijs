import { CmsComponent, ContentLoader } from '@typijs/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticlePage } from '../article/article.pagetype';
import { BlogPage } from './blog.pagetype';

@Component({
    templateUrl: 'blog.component.html'
})
export class BlogComponent extends CmsComponent<BlogPage> implements OnInit {

    articles$: Observable<ArticlePage[]>;

    constructor(private contentLoader: ContentLoader) { super(); }

    ngOnInit() {
        this.articles$ = this.contentLoader.getChildren<ArticlePage>(this.currentContent.contentLink);
    }
}
