import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ComponentFactoryResolver } from '@angular/core';
import { registerPageType, CoreModule } from '@angular-cms/core';

import { PagesModule } from './pages/pages.module';
import * as register from './pages/register';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { LayoutComponent } from './shared/layout/layout.component';
import { BlogTypeSelectionFactory } from './pages/blog/blog-type-selection.factory';

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
    BlogTypeSelectionFactory
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
