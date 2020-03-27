
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CMS } from '@angular-cms/core';

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
                component: DashboardComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'editor',
                component: EditorComponent,
                children: CMS.EDITOR_ROUTES()
            },
            {
                path: 'admin',
                component: AdminComponent,
                children: CMS.ADMIN_ROUTES()
            },
            {
                path: 'preview',
                component: AdminComponent
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