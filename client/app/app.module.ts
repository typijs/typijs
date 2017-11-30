import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ElementsModule } from './elements/elements.module';
import { PagesModule } from './pages/pages.module';
import { AppComponent } from './app.component';
import { PageEditComponent } from './shared/page-edit.component';
import { PageEditDirective } from './shared/page-edit-host.directive';
import * as register from './pages/register';

import { scanScope } from './core/core';

scanScope(register);

@NgModule({
  declarations: [
    AppComponent,
    PageEditComponent,
    PageEditDirective
  ],
  imports: [
    BrowserModule,
    PagesModule,
    ElementsModule
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
