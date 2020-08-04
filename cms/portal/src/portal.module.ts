import "reflect-metadata";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faChevronLeft, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

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
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FontAwesomeModule,
    CmsAngularSplitModule.forRoot(),
    CmsTabsModule.forRoot(),
    CmsBsDropdownModule.forRoot(),
    CmsButtonsModule.forRoot(),
    CmsProgressbarModule.forRoot(),
    CmsModalModule.forRoot(),
    QuillModule.forRoot(),

    DndModule.forRoot(),
    CoreModule.forChild(),
    ...CMS.NG_MODULES,
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
export class CmsPortalModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faChevronRight, faChevronLeft, faAngleUp, faAngleDown);
  }
}
