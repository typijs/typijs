import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { PropertiesModule } from '@angular-cms/properties';
import { CoreModule, DndModule } from '@angular-cms/core';
import { LayoutModule, AngularSplitModule } from '@angular-cms/modules';

import { CmsLayoutComponent } from './shared/cms-layout.component';
import { EditorLayoutComponent } from './editor-layout/editor-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { WidgetService } from './services/widget.service';

import { } from "reflect-metadata";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        CoreModule,
        PropertiesModule,
        LayoutModule,
        AngularSplitModule,
        TabsModule.forRoot(),
        DndModule.forRoot()
    ],
    declarations: [
        CmsLayoutComponent,
        EditorLayoutComponent,
        AdminLayoutComponent
    ],
    exports: [
        EditorLayoutComponent,
        AdminLayoutComponent
    ],
    providers: [WidgetService]
})
export class AdminModule { }
