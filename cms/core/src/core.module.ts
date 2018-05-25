import { NgModule, ModuleWithProviders, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { InsertPointDirective, ContentAreaDirective } from './directives';
import { ContentService, BlockService, PageService, SubjectService } from './services';
import { CmsRenderContentComponent } from './render';
import { DndModule } from './shared';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DndModule.forRoot()
  ],
  declarations: [
    InsertPointDirective,
    CmsRenderContentComponent,
    ContentAreaDirective
  ],
  exports: [
    CmsRenderContentComponent,
    InsertPointDirective,
    ContentAreaDirective
  ],
  providers: [
    ContentService,
    BlockService,
    PageService,
    SubjectService
  ]
})
export class CoreModule { }
