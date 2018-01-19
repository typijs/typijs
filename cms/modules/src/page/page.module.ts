import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '@angular-cms/core';

import { SharedModule } from '../shared/shared.module';
import { PageTreeComponent } from './page-tree.component';
import { ContentModule } from '../content/content.module';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
        ContentModule,
        RouterModule
    ],
    declarations: [
        PageTreeComponent
    ],
    entryComponents: [
        PageTreeComponent
    ],
    exports: [
        PageTreeComponent
    ]
})
export class PageModule { }
