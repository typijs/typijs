import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PropertiesModule } from '@angular-cms/properties';
import { ContentService, CoreModule, CMS } from '@angular-cms/core';

import {
  EditorModule
} from '@angular-cms/editor';

import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms.routing';
import { } from "reflect-metadata";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    PropertiesModule,
    EditorModule,
    ...CMS.EDITOR_MODULES(),
    CmsRoutingModule
  ],
  declarations: [CmsComponent],
  providers: [ContentService],
})
export class CmsModule { }
