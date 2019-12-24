
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CMS } from '@angular-cms/core';
import { EditorLayoutComponent, AdminLayoutComponent } from '@angular-cms/editor';

import './cms-module-register';
import { CmsComponent } from './cms.component';

const cmsRoutes: Routes = [
    {
        path: '', component: CmsComponent,
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
export class CmsRoutingModule { }