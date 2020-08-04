import { CmsModuleRoot, CmsWidgetPosition, AngularCms } from '@angular-cms/core';
import { SiteManageModule } from './site-manage.module';
import { SiteManageComponent, SiteManageEntryComponent } from './site-manage.component';

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