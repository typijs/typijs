import { CmsModuleRoot, CmsWidgetPosition, AngularCms } from '@angular-cms/core';
import { SiteManageModule } from './site-manage.module';
import { SiteManageEntryComponent } from './site-manage-entry.component';
import { SiteManageComponent } from './site-manage.component';

export function registerSiteManageModule() {
    AngularCms.registerModule({
        module: SiteManageModule,
        roots: [
            {
                name: CmsModuleRoot.Admin,
                routes: [
                    {
                        path: 'site-manage',
                        component: SiteManageComponent
                    }
                ],
                widgets: [
                    {
                        component: SiteManageEntryComponent,
                        position: CmsWidgetPosition.Left,
                        group: 'Config'
                    }
                ]
            }
        ]
    })
}