
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CMS, Roles, AuthGuard } from '@angular-cms/core';

import './cms-module-register';
import { PortalComponent } from './portal.component';
import { EditorComponent } from './editor/editor.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const cmsRoutes: Routes = [
    {
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
                children: CMS.EDITOR_ROUTES()
            },
            {
                path: 'admin',
                component: AdminComponent,
                canActivate: [AuthGuard],
                data: {
                    role: Roles.Admin
                },
                children: CMS.ADMIN_ROUTES()
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(cmsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PortalRoutingModule { }