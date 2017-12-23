import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormElementsModule } from './core/form-elements';

import { ContentService } from './core/services';

import {
  EditorLayoutComponent,
  ContentFormEditComponent,
  ContentTypeListComponent
} from './ui/editor';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms.routing';
import { CmsPublicModule } from './cms-public.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormElementsModule,
    CmsRoutingModule,
    CmsPublicModule
  ],
  declarations: [
    ContentFormEditComponent,
    ContentTypeListComponent,
    EditorLayoutComponent,
    CmsComponent
  ],
  exports: [],
  providers: [ContentService],
})
export class CmsModule { }
