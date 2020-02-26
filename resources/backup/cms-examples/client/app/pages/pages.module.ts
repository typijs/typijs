import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { HomeComponent } from './home/home.component';
import { CoreModule } from '@angular-cms/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule
    ],
    entryComponents: [
        BlogComponent,
        HomeComponent
    ],
    declarations: [
        BlogComponent,
        HomeComponent
    ]
})
export class PagesModule { }