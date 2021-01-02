import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDesktop, faExternalLinkAlt, faFileExport, faList, faSave } from '@fortawesome/free-solid-svg-icons';
import { PropertiesModule } from '../properties/properties.module';
// import { CmsAngularSplitModule, CmsTabsModule } from '../shared/libs';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsButtonsModule } from '../shared/libs/ngx-bootstrap/buttons.module';
import { CmsTabsModule } from '../shared/libs/ngx-bootstrap/tabs.module';
import { ContentUpdateComponent } from './content-update/content-update.component';
import { ContentCrudServiceResolver } from './content-crud.service';
import { ContentCreateComponent } from './content-create/content-create.component';

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
        ContentUpdateComponent,
        ContentCreateComponent
    ],
    exports: [
        ContentUpdateComponent,
        ContentCreateComponent
    ]
})
export class ContentModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faList, faDesktop, faSave, faFileExport, faExternalLinkAlt);
    }

    static forRoot(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule,
            providers: [ContentCrudServiceResolver]
        };
    }
}
