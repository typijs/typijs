import "reflect-metadata";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule, CMS } from '@angular-cms/core';
import { PropertiesModule } from '@angular-cms/properties';
import { AdminModule } from '@angular-cms/editor';

import { CmsComponent } from './cms.component';
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
  declarations: [CmsComponent]
})
export class CmsModule { }
