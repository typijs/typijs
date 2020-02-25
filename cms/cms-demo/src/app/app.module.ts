import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AngularCmsModule } from '@angular-cms/core';

import * as contentTypes from './registerContentTypes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { PagesModule } from './pages/pages.module';
import { BlocksModule } from './blocks/block.module';

AngularCmsModule.registerContentTypes(contentTypes);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    AngularCmsModule.forRoot(),
    AppRoutingModule,
    PagesModule,
    BlocksModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
