import "reflect-metadata";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@angular-cms/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList, faDesktop, faSave, faFileExport, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

//import { CmsAngularSplitModule, CmsTabsModule } from '../shared/libs';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsButtonsModule } from '../shared/libs/ngx-bootstrap/buttons.module';
import { CmsTabsModule } from '../shared/libs/ngx-bootstrap/tabs.module';
import { PropertiesModule } from '../properties/properties.module';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';
import { ContentFormEditComponent } from './content-form-edit/content-form-edit.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,

        CmsAngularSplitModule,
        CmsButtonsModule,
        CmsTabsModule,

        CoreModule,
        PropertiesModule,
    ],
    declarations: [
        ContentFormEditComponent,
        ContentTypeListComponent
    ],
    exports: [
        ContentFormEditComponent,
        ContentTypeListComponent
    ],
    entryComponents: [
        ContentTypeListComponent,
        ContentFormEditComponent
    ]
})
export class ContentModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faList, faDesktop, faSave, faFileExport, faExternalLinkAlt);
    }
}
