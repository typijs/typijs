import { NgModule, ModuleWithProviders, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { InsertPointDirective } from './directives/insert-point.directive';

import { LOCAL_STORAGE, localStorageFactory } from './services/browser-storage.service';

import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';

import { OutsideZoneEventPlugin } from './utils/outside-zone-event-plugin';
import { CustomRouteReuseStrategy } from './utils/route-reuse-strategy';

import { CmsPropertyDirective } from './render/cms-property.directive';

import { CmsContentRender } from './render/cms-content';
import { ContentAreaRender } from './render/content-area/content-area';
import { ContentAreaDirective } from './render/content-area/content-area.directive';

import { XHtmlRender } from './render/properties/xhtml';
import { UrlRender } from './render/properties/url';
import { UrlListRender } from './render/properties/url-list';
import { TextRender } from './render/properties/text';


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
  }
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    InsertPointDirective,
    CmsContentRender,
    CmsPropertyDirective,
    ContentAreaRender,
    ContentAreaDirective,
    TextRender,
    UrlListRender,
    UrlRender,
    XHtmlRender
  ],
  exports: [
    CmsContentRender,
    InsertPointDirective,
    ContentAreaDirective,
    CmsPropertyDirective
  ],
  entryComponents: [
    ContentAreaRender,
    TextRender,
    UrlListRender,
    UrlRender,
    XHtmlRender
  ],
  providers: [
    CmsPropertyFactoryResolver //TODO: In Angular 9 , this code should be removed and using Provider Scope  'any'
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
