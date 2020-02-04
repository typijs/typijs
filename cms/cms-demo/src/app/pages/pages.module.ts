import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@angular-cms/core';

import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';
import { BlogComponent } from './blog/blog.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

const PAGES_COMPONENT = [
    HomeComponent,
    ArticleComponent,
    BlogComponent,
    PortfolioComponent
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule
    ],
    entryComponents: [
        ...PAGES_COMPONENT
    ],
    declarations: [
        ...PAGES_COMPONENT
    ]
})
export class PagesModule { }