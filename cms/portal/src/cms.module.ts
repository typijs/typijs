import "reflect-metadata";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CMS, CoreModule } from '@angular-cms/core';
import { CmsAngularSplitModule, CmsBsDropdownModule, CmsTabsModule, DndModule } from '@angular-cms/modules';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms.routing';
import { EditorLayoutComponent } from './editor-layout/editor-layout.component';
import { WidgetService } from './services/widget.service';
import { CmsHeaderComponent } from './shared/components/cms-header/cms-header.component';
import { CmsLayoutComponent } from './shared/components/cms-layout/cms-layout.component';
import { ReplaceDirective } from './shared/directives/replace/replace.directive';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    CoreModule,
    CmsAngularSplitModule.forRoot(),
    CmsTabsModule.forRoot(),
    CmsBsDropdownModule.forRoot(),
    DndModule.forRoot(),

    CmsRoutingModule,
    ...CMS.NG_MODULES
  ],
  declarations: [
    CmsComponent,
    CmsLayoutComponent,
    CmsHeaderComponent,
    ReplaceDirective,
    EditorLayoutComponent,
    AdminLayoutComponent
  ],
  providers: [WidgetService]
})
export class CmsModule { }
