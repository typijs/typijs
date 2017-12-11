import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormElementsModule } from './core/form-elements';
import { UIModule } from './ui/ui.module';
import { InsertPointDirective } from './core/directives';
import { ContentFormEditComponent } from './ui/content-form-edit/content-form-edit.component';
import { CmsComponent } from './cms.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { CmsRoutingModule } from './cms.routing';

@NgModule({
  imports: [
    BrowserModule,
    FormElementsModule,
    CmsRoutingModule
  ],
  declarations: [
    InsertPointDirective,
    ContentFormEditComponent,
    LayoutComponent,
    CmsComponent
  ],
  exports: [
    ContentFormEditComponent,
    InsertPointDirective,
  ],
  providers: [],
})
export class CmsModule { }
