import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CmsWidgetPosition, ADMIN_ROUTES, ADMIN_WIDGETS } from '@angular-cms/core';
import { SiteManageComponent, SiteManageEntryComponent } from './site-manage.component';
import { SiteManageService } from './site-manage.service';
import { CrudModule } from '../shared/crud/crud.module';
import { CrudBaseService } from '../shared/crud/crud.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        CrudModule
    ],
    declarations: [
        SiteManageComponent,
        SiteManageEntryComponent
    ],
    entryComponents: [
        SiteManageComponent,
        SiteManageEntryComponent
    ],
    exports: [
        SiteManageComponent,
        SiteManageEntryComponent
    ]
})
export class SiteManageModule {
    public static forRoot(): ModuleWithProviders<SiteManageModule> {
        return {
            ngModule: SiteManageModule,
            providers: [
                SiteManageService,
                { provide: CrudBaseService, useExisting: SiteManageService },
                {
                    provide: ADMIN_ROUTES, useValue: [
                        {
                            path: 'site-manage',
                            component: SiteManageComponent
                        }
                    ],
                    multi: true
                },
                {
                    provide: ADMIN_WIDGETS, useValue: [
                        {
                            component: SiteManageEntryComponent,
                            position: CmsWidgetPosition.Left,
                            group: 'Config'
                        }
                    ],
                    multi: true
                }
            ]
        }
    }
}
