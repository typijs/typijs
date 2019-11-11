import "reflect-metadata";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CmsTabsModule } from '../shared/ngx-bootstrap/tabs.module';

import { PropertiesModule } from '@angular-cms/properties';
import { CoreModule } from '@angular-cms/core';

import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { ContentFormEditComponent } from './content-form-edit/content-form-edit.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CmsTabsModule.forRoot(),
        PropertiesModule,
        CoreModule,
    ],
    declarations: [
        ContentFormEditComponent,
        ContentTypeListComponent
    ],
    exports: [
        ContentFormEditComponent,
        ContentTypeListComponent
    ]
})
export class ContentModule { }
