import { LayoutComponent } from './layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ComponentFactoryResolver } from '@angular/core';

import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import * as register from './pages/register';

import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './home.component';
import { TestInjectService, BlogTypeSelectionFactory } from './pages/blog/test.service';
import { registerPageType, CoreModule } from '@angular-cms/core';

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
    HomeComponent,
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
