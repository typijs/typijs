import "reflect-metadata";
import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule, CmsPropertyProvider } from '@angular-cms/core';

import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsTabsModule } from '../shared/libs/ngx-bootstrap/tabs.module';
import { PropertiesModule } from '../properties/properties.module';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { ContentFormEditComponent } from './content-form-edit/content-form-edit.component';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CoreModule,
        CmsAngularSplitModule.forRoot(),
        CmsTabsModule.forRoot(),
        PropertiesModule,
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
