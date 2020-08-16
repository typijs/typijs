import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';
import { CmsPageRender } from './renders/page-render';
import { ContentAreaPropertyRender, ContentArea } from './renders/content-area/content-area';
import { ContentAreaDirective } from './renders/content-area/content-area.directive';
import { InsertPointDirective } from './renders/insert-point.directive';
import { CmsPropertyDirective } from './renders/cms-property.directive';
import { ObjectListRender, TextPropertyRender, UrlListRender, UrlRender, XHtmlPropertyRender } from './renders/property-render';
import { ImageRenderDirective } from "./renders/image/image-render.directive";
import { ImagePropertyRender } from "./renders/image/image-render";
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
