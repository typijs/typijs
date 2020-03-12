import "reflect-metadata";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CMS, CoreModule } from '@angular-cms/core';
import { CmsAngularSplitModule, CmsBsDropdownModule, CmsTabsModule, DndModule } from '@angular-cms/modules';

import { CmsHeaderComponent } from './shared/components/cms-header/cms-header.component';
import { CmsLayoutComponent } from './shared/components/cms-layout/cms-layout.component';
import { ReplaceDirective } from './shared/directives/replace/replace.directive';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { EditorLayoutComponent } from './editor-layout/editor-layout.component';
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

    CoreModule,
    DndModule.forRoot(),
    PortalRoutingModule,
    ...CMS.NG_MODULES
  ],
  declarations: [
    PortalComponent,
    CmsLayoutComponent,
    CmsHeaderComponent,
    ReplaceDirective,
    EditorLayoutComponent,
    AdminLayoutComponent
  ],
  providers: [WidgetService]
})
export class CmsPortalModule { }
