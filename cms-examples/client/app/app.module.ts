import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ComponentFactoryResolver } from '@angular/core';

import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import * as register from './pages/register';

import { AppRoutingModule } from './app.routing';
import { TestInjectService, BlogTypeSelectionFactory } from './pages/blog/test.service';
import { registerPageType, CoreModule } from '@angular-cms/core';
import { LayoutComponent } from './pages/shared/layout/layout.component';

registerPageType(register);

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    PagesModule,
    CoreModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  providers:[
    TestInjectService,
    BlogTypeSelectionFactory
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
