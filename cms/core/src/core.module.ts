import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';
import { CmsContentRender } from './infrastructure/rendering/cms-content';
import { ContentAreaRender, ContentArea } from './infrastructure/rendering/content-area/content-area';
import { ContentAreaDirective } from './infrastructure/rendering/content-area/content-area.directive';
import { InsertPointDirective } from './infrastructure/rendering/insert-point.directive';
import { CmsPropertyDirective } from './infrastructure/rendering/property/cms-property.directive';
import { ImageRender, ObjectListRender, TextRender, UrlListRender, UrlRender, XHtmlRender, CmsImageRender } from './infrastructure/rendering/property/property-render';
import { SafePipe } from './pipes/safe.pipe';
import { AbsolutePipe } from './pipes/absolute.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SafePipe,
    AbsolutePipe,

    InsertPointDirective,
    CmsContentRender,
    CmsPropertyDirective,
    ContentAreaDirective,

    ContentArea,
    CmsImageRender,

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
    AbsolutePipe,

    ContentArea,
    CmsImageRender,

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
      providers: [CmsPropertyFactoryResolver]
    };
  }
}
