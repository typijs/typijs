import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { InsertPointDirective, ContentAreaDirective } from './directives';
import { ContentService, BlockService, PageService, SubjectService, MediaService } from './services';
import { CmsRenderContentComponent } from './render';
import { OutsideZoneEventPlugin } from './utils/outside-zone-event-plugin';

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
export class CoreModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [{
        provide: EVENT_MANAGER_PLUGINS,
        useClass: OutsideZoneEventPlugin,
        multi: true
      }]
    };
  }

}
