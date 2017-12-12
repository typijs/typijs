import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FormElementsModule } from './core/form-elements';
import { InsertPointDirective } from './core/directives';

import { ContentService } from './core/services';

import {
  EditorLayoutComponent,
  ContentFormEditComponent,
  ContentTypeListComponent
} from './ui/editor';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms.routing';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormElementsModule,
    CmsRoutingModule
  ],
  declarations: [
    InsertPointDirective,
    ContentFormEditComponent,
    ContentTypeListComponent,
    EditorLayoutComponent,
    CmsComponent
  ],
  exports: [
    ContentFormEditComponent,
    InsertPointDirective,
  ],
  providers: [ContentService],
})
export class CmsModule { }
