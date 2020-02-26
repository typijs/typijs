import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ContentAreaDirective } from './directives/content-area.directive';
import { InsertPointDirective } from './directives/insert-point.directive';

import { BlockService } from './services/block.service';
import { PageService } from './services/page.service';
import { MediaService } from './services/media.service';

import { CmsRenderContentComponent } from './render/cms-content';

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
    BlockService,
    PageService,
    MediaService
  ]
})
export class CoreModule { }
