import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ComponentFactoryResolver } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { registerContentTypes, CoreModule, CMS } from '@angular-cms/core';

import { PagesModule } from './pages/pages.module';
import { BlocksModule } from './blocks/blocks.module';

import * as contentTypes from './registerContentTypes';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { LayoutComponent } from './shared/layout/layout.component';
import { BlogTypeSelectionFactory } from './pages/blog/blog-type-selection.factory';
import { TestComponent } from './test.component';
import { CommonModule } from '@angular/common';
import { TestWidget } from './test.widget';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TestComponent,
        TestWidget
    ],
    exports: [
        TestWidget,
        TestComponent
    ],
    entryComponents: [
        TestWidget
    ]
  })
export class TestModule {

 }
