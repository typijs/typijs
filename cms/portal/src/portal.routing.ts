
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route, ROUTES } from '@angular/router';

import { EDITOR_ROUTES, ADMIN_ROUTES, Roles, AuthGuard } from '@angular-cms/core';

import { PortalComponent } from './portal.component';
import { EditorComponent } from './editor/editor.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export function getPortalRoutes(editorRoutes: Routes[], adminRoutes: Routes[]): Route[] {
    const childEditorRoutes: Route[] = editorRoutes.reduce((a, b) => a.concat(b), []);
    const childAdminRoutes: Route[] = adminRoutes.reduce((a, b) => a.concat(b), []);
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
                children: childEditorRoutes
            },
            {
                path: 'admin',
                component: AdminComponent,
                canActivate: [AuthGuard],
                data: {
                    role: Roles.Admin
                },
                children: childAdminRoutes
            }
        ]
    }];
}

@NgModule({
    imports: [
        RouterModule.forChild([])
    ],
    exports: [
        RouterModule
    ],
    providers: [
        {
            provide: ROUTES,
            useFactory: getPortalRoutes,
            deps: [EDITOR_ROUTES, ADMIN_ROUTES],
            multi: true
        }
    ]
})
export class PortalRoutingModule { }
