import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BlogComponent } from './blog/blog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        BlogComponent
    ]
})
export class PagesModule { }