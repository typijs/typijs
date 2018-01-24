import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PropertiesModule } from '@angular-cms/properties';
import { ContentService, CoreModule } from '@angular-cms/core';
import { LayoutModule } from '@angular-cms/modules';

import { EditorLayoutComponent } from './editor-layout/editor-layout.component';

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
        LayoutModule
    ],
    declarations: [
        EditorLayoutComponent
    ],
    exports: [
        EditorLayoutComponent
    ],
})
export class EditorModule { }
