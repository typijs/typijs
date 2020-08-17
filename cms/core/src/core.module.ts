import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CmsPropertyFactoryResolver } from './bases/cms-property.factory';
import { AbsolutePipe } from './pipes/absolute.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { CmsPropertyDirective } from './renders/cms-property.directive';
import { ContentAreaPropertyRender } from './renders/content-area/content-area';
import { ContentAreaRenderDirective } from './renders/content-area/content-area-as-directive';
import { ContentAreaDirective } from './renders/content-area/content-area.directive';
import { ImagePropertyRender } from "./renders/image/image-render";
import { ImageRenderDirective } from "./renders/image/image-render.directive";
import { InsertPointDirective } from './renders/insert-point.directive';
import { ObjectListPropertyRender } from './renders/object-list/object-list-render';
import { CmsPageRender } from './renders/page-render';
import { TextPropertyRender } from "./renders/text/text-render";
import { UrlListPropertyRender } from "./renders/url-list/url-list-render";
import { UrlPropertyRender } from "./renders/url/url-render";
import { XHtmlPropertyRender } from "./renders/xhtml/xhtml-render";
import { TextRenderDirective } from './renders/text/text-render-as-directive';
import { UrlRenderDirective } from './renders/url/url-render.directive';
import { UrlListRenderDirective } from './renders/url-list/url-list-render-as-directive';
import { XHtmlRenderDirective } from './renders/xhtml/xhtml-render.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SafePipe,
    AbsolutePipe,

    InsertPointDirective,
    CmsPageRender,
    CmsPropertyDirective,

    ContentAreaDirective,
    ContentAreaRenderDirective,
    ContentAreaPropertyRender,

    ImageRenderDirective,
    ImagePropertyRender,

    ObjectListPropertyRender,

    TextRenderDirective,
    TextPropertyRender,

    XHtmlRenderDirective,
    XHtmlPropertyRender,

    UrlPropertyRender,
    UrlRenderDirective,

    UrlListPropertyRender,
    UrlListRenderDirective,
  ],
  exports: [
    SafePipe,
    AbsolutePipe,

    ContentAreaRenderDirective,
    ImageRenderDirective,
    TextRenderDirective,
    XHtmlRenderDirective,
    UrlRenderDirective,
    UrlListRenderDirective,

    CmsPageRender,
    InsertPointDirective,
    CmsPropertyDirective
  ],
  entryComponents: [
    ContentAreaPropertyRender,
    ImagePropertyRender,
    ObjectListPropertyRender,

    TextPropertyRender,
    XHtmlPropertyRender,
    UrlPropertyRender,
    UrlListPropertyRender,
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
