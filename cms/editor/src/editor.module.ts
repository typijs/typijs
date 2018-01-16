import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PropertiesModule } from '@angular-cms/properties';
import { ContentService, CoreModule } from '@angular-cms/core';

import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { EditorLayoutComponent } from './editor-layout/editor-layout.component';
import { ContentFormEditComponent } from './content-form-edit/content-form-edit.component';
import { ContentTreeComponent } from './content-tree/content-tree.component';

import { } from "reflect-metadata";
import { TreeStore } from './content-tree/tree-store';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        PropertiesModule,
        CoreModule,
        RouterModule
    ],
    declarations: [
        ContentFormEditComponent,
        ContentTypeListComponent,
        EditorLayoutComponent,
        ContentTreeComponent
    ],
    exports: [
        ContentFormEditComponent,
        ContentTypeListComponent,
        EditorLayoutComponent
    ],
    providers: [TreeStore]
})
export class EditorModule { }
