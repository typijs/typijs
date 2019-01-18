import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { InsertPointDirective, ContentAreaDirective } from './directives';
import { ContentService, BlockService, PageService, SubjectService, MediaService } from './services';
import { CmsRenderContentComponent } from './render';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
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
    MediaService,
    SubjectService
  ]
})
export class CoreModule {}
