import { LayoutComponent } from './layout.component';
import { BlogTypeSelectionFactory } from './pages/blog/blog.pagetype';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CmsModule } from './cms/cms.module';

import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import * as register from './pages/register';

import { registerPageType } from './cms/core';
import { AppRoutingModule } from './app.routing';
import { HomeComponent } from './home.component';
import { TestInjectService } from './pages/blog/test.service';

registerPageType(register);

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    PagesModule,
    CmsModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent
  ],
  providers:[
    BlogTypeSelectionFactory,
    TestInjectService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
