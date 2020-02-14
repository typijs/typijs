import { Component, OnInit } from '@angular/core';
import { CmsComponent, PageService } from '@angular-cms/core';
import { PortfolioPage } from './portfolio.pagetype';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticlePage } from '../article/article.pagetype';

@Component({
    templateUrl: 'portfolio.component.html'
})

export class PortfolioComponent extends CmsComponent<PortfolioPage> {
    portfolioPages$: Observable<ArticlePage[]>;
    constructor(private contentService: PageService) {
        super();
    }

    ngOnInit() {
        this.portfolioPages$ = this.contentService.getPublishedPageChildren(this.currentContent.id).pipe(
            map(children => children.map(childPage => new ArticlePage(childPage)))
        )
    }
}