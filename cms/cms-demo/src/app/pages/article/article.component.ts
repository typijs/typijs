import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { ArticlePage } from './article.pagetype';

@Component({
    templateUrl: 'article.component.html'
})
export class ArticleComponent extends CmsComponent<ArticlePage> {
    constructor() {
        super();
    }
}
