import { NgModule, ModuleWithProviders, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { ContentAreaDirective } from './directives/content-area.directive';
import { InsertPointDirective } from './directives/insert-point.directive';

import { BlockService } from './services/block.service';
import { PageService } from './services/page.service';
import { MediaService } from './services/media.service';
import { LOCAL_STORAGE, localStorageFactory } from './services/browser-storage.service';

import { CmsRenderContentComponent } from './render/cms-content';
import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';

import { OutsideZoneEventPlugin } from './utils/outside-zone-event-plugin';
import { CustomRouteReuseStrategy } from './utils/route-reuse-strategy';

export const CMS_PROVIDERS = [
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: OutsideZoneEventPlugin,
    multi: true
  },
  {
    provide: RouteReuseStrategy,
    useClass: CustomRouteReuseStrategy
  },
  {
    provide: LOCAL_STORAGE,
    useFactory: localStorageFactory,
    deps: [PLATFORM_ID]
  },
  CmsPropertyFactoryResolver,

]

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
export class CoreModule {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...CMS_PROVIDERS]
    };
  }
}
