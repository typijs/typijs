import 'reflect-metadata';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight, faChevronLeft, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { CoreModule } from '@angular-cms/core';
import { AngularSplitModule } from 'angular-split';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import {
    DndModule,
    PageModule,
    MediaModule,
    BlockModule,
    PropertiesModule,
    ContentModule,
    SiteDefinitionModule,
    ContentTypeModule,
    ContentVersionModule
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
        AngularSplitModule.forRoot(),
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        ButtonsModule.forRoot(),
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        QuillModule.forRoot(),

        DndModule.forRoot(),
        CoreModule.forRoot(),
        PropertiesModule.forRoot(),
        ContentModule.forRoot(),
        PageModule.forRoot(),
        MediaModule.forRoot(),
        BlockModule.forRoot(),
        SiteDefinitionModule.forRoot(),
        ContentTypeModule.forRoot(),
        ContentVersionModule.forRoot(),
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

    static forRoot(): ModuleWithProviders<CmsPortalModule> {
        return {
            ngModule: CmsPortalModule,
            providers: [WidgetService]
        };
    }
}
