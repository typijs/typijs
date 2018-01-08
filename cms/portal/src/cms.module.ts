import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormElementsModule } from '@angular-cms/form';
import { ContentService, CoreModule } from '@angular-cms/core';

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
    FormElementsModule,
    EditorModule,
    CmsRoutingModule
  ],
  declarations: [
    CmsComponent
  ],
  providers: [ContentService],
})
export class CmsModule { }
