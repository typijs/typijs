import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngularCms } from '@angular-cms/core';

import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';
import { BlogComponent } from './blog/blog.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { RouterModule } from '@angular/router';

const PAGES_COMPONENT = [
    HomeComponent,
    ArticleComponent,
    BlogComponent,
    PortfolioComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        AngularCms
    ],
    entryComponents: [
        ...PAGES_COMPONENT
    ],
    declarations: [
        ...PAGES_COMPONENT
    ]
})
export class PagesModule { }
