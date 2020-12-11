import { AngularCms } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeroBannerComponent } from '../shared/hero-banner/hero-banner.component';
import { ArticleComponent } from './article/article.component';
import { BlogComponent } from './blog/blog.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { StandardPageComponent } from './standard/standard.component';

const PAGES_COMPONENT = [
    ArticleComponent,
    BlogComponent,
    ContactComponent,
    HomeComponent,
    StandardPageComponent,
    HeroBannerComponent
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
