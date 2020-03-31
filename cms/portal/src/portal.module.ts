import "reflect-metadata";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CMS, CoreModule } from '@angular-cms/core';
import {
  CmsAngularSplitModule,
  CmsBsDropdownModule,
  CmsButtonsModule,
  CmsTabsModule,
  CmsProgressbarModule,
  CmsModalModule,
  DndModule
} from '@angular-cms/modules';

import { CmsHeaderComponent } from './shared/components/cms-header/cms-header.component';
import { CmsLayoutComponent } from './shared/components/cms-layout/cms-layout.component';
import { ReplaceDirective } from './shared/directives/replace/replace.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { EditorComponent } from './editor/editor.component';
import { WidgetService } from './services/widget.service';
import { PortalComponent } from './portal.component';
import { PortalRoutingModule } from './portal.routing';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    CmsAngularSplitModule.forRoot(),
    CmsTabsModule.forRoot(),
    CmsBsDropdownModule.forRoot(),
    CmsButtonsModule.forRoot(),
    CmsProgressbarModule.forRoot(),
    CmsModalModule.forRoot(),

    DndModule.forRoot(),

    ...CMS.NG_MODULES,
    CoreModule.forRoot(),
    PortalRoutingModule
  ],
  declarations: [
    PortalComponent,
    CmsLayoutComponent,
    CmsHeaderComponent,
    ReplaceDirective,
    DashboardComponent,
    AdminComponent,
    EditorComponent
  ],
  providers: [WidgetService]
})
export class CmsPortalModule { }
