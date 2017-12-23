import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsertPointDirective } from './core/directives';

import { ContentService } from './core/services';

import { CmsTemplateComponent } from './core/render/cms-template';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    InsertPointDirective,
    CmsTemplateComponent
  ],
  exports: [
    CmsTemplateComponent,
    InsertPointDirective
  ],
  providers: [ContentService],
})
export class CmsPublicModule { }
