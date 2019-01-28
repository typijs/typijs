
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsComponent } from './cms.component';
import { EditorLayoutComponent, AdminLayoutComponent } from '@angular-cms/editor';
import { CMS } from '@angular-cms/core';
import { registerPageModule, registerBlockModule, registerMediaModule, registerSiteManageModule } from '@angular-cms/modules';

//register module for editor
registerPageModule();
registerMediaModule();
registerBlockModule();

//register module for admin
registerSiteManageModule();

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