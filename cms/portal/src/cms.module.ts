import "reflect-metadata";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule, CMS } from '@angular-cms/core';
import { AngularSplitModule, CmsTabsModule, CmsBsDropdownModule, DndModule } from '@angular-cms/modules';

import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms.routing';
import { CmsLayoutComponent } from './shared/components/cms-layout/cms-layout.component';
import { EditorLayoutComponent } from './editor-layout/editor-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { WidgetService } from './services/widget.service';
import { CmsHeaderComponent } from './shared/components/cms-header/cms-header.component';
import { CmsFooterComponent } from './shared/components/cms-footer/cms-footer.component';
import { ReplaceDirective } from './shared/directives/replace/replace.directive';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    CoreModule,
    AngularSplitModule,

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
    CmsFooterComponent,
    ReplaceDirective,
    EditorLayoutComponent,
    AdminLayoutComponent
  ],
  providers: [WidgetService]
})
export class CmsModule { }
