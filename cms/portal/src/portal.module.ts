import "reflect-metadata";
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faChevronLeft, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { CoreModule, EDITOR_ROUTES, ADMIN_ROUTES, ADMIN_WIDGETS, EDITOR_WIDGETS } from '@angular-cms/core';
import {
  CmsAngularSplitModule,
  CmsBsDropdownModule,
  CmsButtonsModule,
  CmsTabsModule,
  CmsProgressbarModule,
  CmsModalModule,
  DndModule,
  PageModule,
  MediaModule,
  BlockModule,
  PropertiesModule,
  SiteManageModule
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
    PropertiesModule.forRoot(),
    PageModule.forRoot(),
    MediaModule.forRoot(),
    BlockModule.forRoot(),
    SiteManageModule.forRoot(),
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
  ]
})
export class CmsPortalModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faChevronRight, faChevronLeft, faAngleUp, faAngleDown);
  }

  public static forRoot(): ModuleWithProviders<CmsPortalModule> {
    return {
      ngModule: CmsPortalModule,
      providers: [
        WidgetService,
        { provide: EDITOR_ROUTES, useValue: [], multi: true },
        { provide: ADMIN_ROUTES, useValue: [], multi: true },
        { provide: ADMIN_WIDGETS, useValue: [], multi: true },
        { provide: EDITOR_WIDGETS, useValue: [], multi: true }
      ]
    }
  }
}
