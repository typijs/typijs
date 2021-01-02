import { CmsWidgetPosition, CoreModule, EDITOR_WIDGETS } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDesktop, faExternalLinkAlt, faFileExport, faList, faSave } from '@fortawesome/free-solid-svg-icons';
import { CrudModule } from '../shared/crud/crud.module';
import { CmsButtonsModule } from '../shared/libs/ngx-bootstrap/buttons.module';
import { CmsTabsModule } from '../shared/libs/ngx-bootstrap/tabs.module';
import { ContentVersionComponent } from './content-version.component';
import { ContentVersionServiceResolver } from './content-version.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,

        CmsButtonsModule,
        CmsTabsModule,

        CoreModule,
        CrudModule
    ],
    declarations: [
        ContentVersionComponent
    ]
})
export class ContentVersionModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faList, faDesktop, faSave, faFileExport, faExternalLinkAlt);
    }

    static forRoot(): ModuleWithProviders<ContentVersionModule> {
        return {
            ngModule: ContentVersionModule,
            providers: [
                ContentVersionServiceResolver,
                {
                    provide: EDITOR_WIDGETS, useValue: { group: 'Pages', position: CmsWidgetPosition.Left, component: ContentVersionComponent, order: 50, isSplit: true },
                    multi: true
                },
            ]
        };
    }
}
