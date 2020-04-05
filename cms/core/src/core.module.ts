import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CMS } from './cms';
import { InsertPointDirective } from './directives/insert-point.directive';
import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';

import { CmsPropertyDirective } from './render/cms-property.directive';
import { CmsContentRender } from './render/cms-content';
import { ContentAreaRender } from './render/content-area/content-area';
import { ContentAreaDirective } from './render/content-area/content-area.directive';
import { XHtmlRender } from './render/properties/xhtml';
import { UrlRender } from './render/properties/url';
import { UrlListRender } from './render/properties/url-list';
import { TextRender } from './render/properties/text';
import { ImageRender } from './render/properties/image';

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
    XHtmlRender,
    ImageRender
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
    ImageRender,
    UrlListRender,
    UrlRender,
    XHtmlRender
  ]
})
export class CoreModule {
  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...CMS.PROPERTY_PROVIDERS, CmsPropertyFactoryResolver]
    };
  }
}
