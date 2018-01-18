
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmsComponent } from './cms.component';
import {
    EditorLayoutComponent,
    ContentFormEditComponent,
    ContentTypeListComponent
} from '@angular-cms/editor';
import { CMS } from '@angular-cms/core';

let childrenRoutes = [];
childrenRoutes.push({
        path: 'new/:type', //type is 'block' or 'page'
        component: ContentTypeListComponent
});
childrenRoutes.push( {
    path: 'new/:type/:parentId', //type is 'block' or 'page'
    component: ContentTypeListComponent
});
childrenRoutes.push( {
    path: 'content/:type/:id', //type is 'block' or 'page'
    component: ContentFormEditComponent
});
childrenRoutes = childrenRoutes.concat(CMS.EDITOR_ROUTES());

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
                children: childrenRoutes
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