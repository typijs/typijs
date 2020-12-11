import { CmsComponent, PageService } from '@angular-cms/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticlePage } from '../article/article.pagetype';
import { BlogPage } from './blog.pagetype';

@Component({
    templateUrl: 'blog.component.html'
})
export class BlogComponent extends CmsComponent<BlogPage> implements OnInit {

    articles$: Observable<ArticlePage[]>;

    constructor(private contentService: PageService) { super(); }

    ngOnInit() {
        this.articles$ = this.contentService.getPageChildren(this.currentContent.id).pipe(
            map(pages => pages.map(x => x as ArticlePage))
        );
    }
}
