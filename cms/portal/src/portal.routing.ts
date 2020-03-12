
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CMS } from '@angular-cms/core';

import './cms-module-register';
import { PortalComponent } from './portal.component';
import { EditorLayoutComponent } from './editor-layout/editor-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

const cmsRoutes: Routes = [
    {
        path: '', component: PortalComponent,
        children: [
            {
                path: '',
                component: EditorLayoutComponent
            },
            {
                path: 'editor',
                component: EditorLayoutComponent,
                children: CMS.EDITOR_ROUTES()
            },
            {
                path: 'admin',
                component: AdminLayoutComponent,
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