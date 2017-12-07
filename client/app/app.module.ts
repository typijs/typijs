import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CmsModule } from './cms/cms.module';

import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import * as register from './pages/register';

import { registerPageType } from './cms/core';

registerPageType(register);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    PagesModule,
    CmsModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
