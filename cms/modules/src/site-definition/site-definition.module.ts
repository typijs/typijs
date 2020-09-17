import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CmsWidgetPosition, ADMIN_ROUTES, ADMIN_WIDGETS } from '@angular-cms/core';
import { SiteDefinitionListComponent, SiteDefinitionMenuComponent, SiteDefinitionDetailComponent } from './site-definition.component';
import { SiteDefinitionService } from './site-definition.service';
import { CrudModule } from '../shared/crud/crud.module';
import { LanguageSelectionFactory } from './site-definition.model';

const siteRoutes: Routes = [
    {
        path: 'site-manage',
        component: SiteDefinitionListComponent
    },
    {
        path: 'site-manage/:id',
        component: SiteDefinitionDetailComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        CrudModule
    ],
    declarations: [
        SiteDefinitionListComponent,
        SiteDefinitionMenuComponent,
        SiteDefinitionDetailComponent
    ],
    entryComponents: [
        SiteDefinitionListComponent,
        SiteDefinitionMenuComponent,
        SiteDefinitionDetailComponent
    ]
})
export class SiteDefinitionModule {
    static forRoot(): ModuleWithProviders<SiteDefinitionModule> {
        return {
            ngModule: SiteDefinitionModule,
            providers: [
                SiteDefinitionService,
                LanguageSelectionFactory,
                { provide: ADMIN_ROUTES, useValue: siteRoutes, multi: true },
                {
                    provide: ADMIN_WIDGETS, useValue: [
                        {
                            component: SiteDefinitionMenuComponent,
                            position: CmsWidgetPosition.Left,
                            group: 'Config'
                        }
                    ],
                    multi: true
                }
            ]
        };
    }
}
