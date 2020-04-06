import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CMS } from './cms';
import { InsertPointDirective } from './directives/insert-point.directive';
import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';

import { CmsPropertyDirective } from './render/property/cms-property.directive';
import { CmsContentRender } from './render/cms-content';
import { ContentAreaRender } from './render/content-area/content-area';
import { ContentAreaDirective } from './render/content-area/content-area.directive';
import { TextRender, XHtmlRender, ImageRender, UrlRender, UrlListRender, ObjectListRender } from './render/property/property-render';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    InsertPointDirective,
    CmsContentRender,
    CmsPropertyDirective,
    ContentAreaDirective,

    ContentAreaRender,
    TextRender,
    XHtmlRender,
    ImageRender,
    UrlRender,
    UrlListRender,
    ObjectListRender
  ],
  exports: [
    CmsContentRender,
    InsertPointDirective,
    CmsPropertyDirective,
    ContentAreaDirective
  ],
  entryComponents: [
    ContentAreaRender,
    TextRender,
    XHtmlRender,
    ImageRender,
    UrlRender,
    UrlListRender,
    ObjectListRender
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
