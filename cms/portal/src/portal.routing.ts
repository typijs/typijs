
import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { RouterModule, Routes, Route, ROUTES } from '@angular/router';

import { CMS, Roles, AuthGuard, CmsModuleRoot } from '@angular-cms/core';

import './cms-module-register';
import { PortalComponent } from './portal.component';
import { EditorComponent } from './editor/editor.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { pageModuleConfig } from '@angular-cms/modules';

export function getChildRoutes(childModuleName: CmsModuleRoot): Route[] {
    let result = [];
    pageModuleConfig.filter(x => x.name == childModuleName).map(x => x.routes).forEach(routers => {
        if (routers) result = result.concat(routers)
    });
    return result;
}

export function getPortalRoutes(): Route[] {
    const editorRoutes = getChildRoutes(CmsModuleRoot.Editor)
    const adminRoutes = getChildRoutes(CmsModuleRoot.Admin)
    return [{
        path: '', component: PortalComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthGuard],
                data: {
                    role: Roles.Editor
                }
            },
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuard],
                data: {
                    role: Roles.Editor
                }
            },
            {
                path: 'editor',
                component: EditorComponent,
                canActivate: [AuthGuard],
                data: {
                    role: Roles.Editor
                },
                children: editorRoutes
            },
            {
                path: 'admin',
                component: AdminComponent,
                canActivate: [AuthGuard],
                data: {
                    role: Roles.Admin
                },
                children: adminRoutes
            }
        ]
    }];
};

@NgModule({
    imports: [
        RouterModule.forChild([])
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [PortalComponent, DashboardComponent, EditorComponent, AdminComponent],
    providers: [
        {
            provide: ROUTES,
            useFactory: getPortalRoutes,
            useValue: {},
            multi: true
        },
        //{ provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: cmsRoutes },
    ]
})
export class PortalRoutingModule { }