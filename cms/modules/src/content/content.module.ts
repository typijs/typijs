import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDesktop, faExternalLinkAlt, faFileExport, faList, faSave } from '@fortawesome/free-solid-svg-icons';
import 'reflect-metadata';
import { PropertiesModule } from '../properties/properties.module';
// import { CmsAngularSplitModule, CmsTabsModule } from '../shared/libs';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsButtonsModule } from '../shared/libs/ngx-bootstrap/buttons.module';
import { CmsTabsModule } from '../shared/libs/ngx-bootstrap/tabs.module';
import { ContentFormEditComponent } from './content-form-edit/content-form-edit.component';
import { ContentFormServiceResolver } from './content-form.service';
import { ContentTypeListComponent } from './content-type-list/content-type-list.component';

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

    static forRoot(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule,
            providers: [ContentFormServiceResolver]
        };
    }
}
