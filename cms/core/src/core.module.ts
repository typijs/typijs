import { NgModule, ModuleWithProviders, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { InsertPointDirective, ContentAreaDirective } from './directives';
import { ContentService } from './services';
import { CmsTemplateComponent } from './render';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    InsertPointDirective,
    CmsTemplateComponent,
    ContentAreaDirective
  ],
  exports: [
    CmsTemplateComponent,
    InsertPointDirective,
    ContentAreaDirective
  ],
  entryComponents: [
    CmsTemplateComponent
  ],
  providers: [ContentService]
})
export class CoreModule {}
