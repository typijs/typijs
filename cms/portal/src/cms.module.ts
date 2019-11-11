import "reflect-metadata";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContentService, CoreModule, CMS } from '@angular-cms/core';
import { registerPageModule, registerBlockModule, registerMediaModule, registerSiteManageModule } from '@angular-cms/modules';
import { PropertiesModule } from '@angular-cms/properties';
import { AdminModule } from '@angular-cms/editor';

import { CmsComponent } from './cms.component';

//register module for editor
registerPageModule();
registerMediaModule();
registerBlockModule();

//register module for admin
registerSiteManageModule();
//must register before import Cms Routing Module
import { CmsRoutingModule } from './cms.routing';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    PropertiesModule,
    AdminModule,
    CmsRoutingModule,
    ...CMS.NG_MODULES
  ],
  declarations: [CmsComponent],
  providers: [ContentService],
})
export class CmsModule { }
