import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormElementsModule } from './core/form-elements';
import { UIModule } from './ui/ui.module';
import { InsertPointDirective } from './core/directives';
import { ContentFormEditComponent } from './ui/content-form-edit/content-form-edit.component';

@NgModule({
  imports: [
    BrowserModule,
    FormElementsModule,
    //UIModule
  ],
  declarations: [
    InsertPointDirective,
    ContentFormEditComponent
  ],
  exports: [
    ContentFormEditComponent,
    InsertPointDirective
  ],
  providers: [],
})
export class CmsModule { }
