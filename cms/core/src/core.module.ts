import { NgModule, ModuleWithProviders, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { InsertPointDirective } from './directives';
import { ContentService } from './services';
import { CmsTemplateComponent, CmsContentAreaComponent } from './render';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    InsertPointDirective,
    CmsTemplateComponent,
    CmsContentAreaComponent
  ],
  exports: [
    CmsTemplateComponent,
    CmsContentAreaComponent,
    InsertPointDirective
  ],
  entryComponents: [
    CmsTemplateComponent,
    CmsContentAreaComponent
  ],
  providers: [ContentService]
})
export class CoreModule {}
