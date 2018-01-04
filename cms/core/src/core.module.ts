import { NgModule, ModuleWithProviders, ComponentFactoryResolver } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { InsertPointDirective } from './directives';
import { ContentService } from './services';
import { CmsTemplateComponent } from './render/cms-template';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    InsertPointDirective,
    CmsTemplateComponent
  ],
  exports: [
    CmsTemplateComponent,
    InsertPointDirective
  ],
  entryComponents: [
    CmsTemplateComponent
  ],
  providers: [ContentService]
})
export class CoreModule {}
