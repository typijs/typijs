import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';
import { CMS } from './cms';
import { CmsContentRender } from './infrastructure/rendering/cms-content';
import { ContentAreaRender } from './infrastructure/rendering/content-area/content-area';
import { ContentAreaDirective } from './infrastructure/rendering/content-area/content-area.directive';
import { InsertPointDirective } from './infrastructure/rendering/insert-point.directive';
import { CmsPropertyDirective } from './infrastructure/rendering/property/cms-property.directive';
import { ImageRender, ObjectListRender, TextRender, UrlListRender, UrlRender, XHtmlRender } from './infrastructure/rendering/property/property-render';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    SafePipe,

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
    SafePipe,
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
  public static forChild(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [...CMS.PROPERTY_PROVIDERS, CmsPropertyFactoryResolver]
    };
  }
}
