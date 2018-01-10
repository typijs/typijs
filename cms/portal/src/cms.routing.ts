
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
                        path: 'new/:type', //type is 'block' or 'page'
                        component: ContentTypeListComponent,
                    },
                    {
                        path: 'new/:type/:parentId', //type is 'block' or 'page'
                        component: ContentTypeListComponent,
                    },
                    {
                        path: 'content/:type/:id', //type is 'block' or 'page'
                        component: ContentFormEditComponent,
                        
                    }
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