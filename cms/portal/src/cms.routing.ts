
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsComponent } from './cms.component';
import {
    EditorLayoutComponent,
    ContentFormEditComponent,
    ContentTypeListComponent
  } from '@angular-cms/editor';

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
                children: [
                    {
                        path: 'new-page',
                        component: ContentTypeListComponent
                    },
                    {
                        path: 'new-page/:id',
                        component: ContentTypeListComponent
                    },
                    {
                        path: 'content/:id',
                        component: ContentFormEditComponent
                    },
                ]
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