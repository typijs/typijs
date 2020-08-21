import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AngularCms, AuthModule } from '@angular-cms/core';

import * as contentTypes from './register-content-types';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { PagesModule } from './pages/pages.module';
import { BlocksModule } from './blocks/block.module';
import { HttpClientModule } from '@angular/common/http';

AngularCms.registerContentTypes(contentTypes);

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    HttpClientModule,
    AngularCms.forRoot(),
    AuthModule,
    AppRoutingModule,
    PagesModule,
    BlocksModule
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
