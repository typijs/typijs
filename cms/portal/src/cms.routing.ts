
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsComponent } from './cms.component';
import { EditorLayoutComponent } from '@angular-cms/editor';
import { CMS } from '@angular-cms/core';
import { registerPageModule, registerBlockModule, registerMediaModule } from '@angular-cms/modules';

registerPageModule();
registerMediaModule();
registerBlockModule();

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