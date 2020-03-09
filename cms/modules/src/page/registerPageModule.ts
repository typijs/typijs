import { CmsModuleRoot, CmsWidgetPosition, AngularCms } from '@angular-cms/core';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { PageTreeComponent } from './page-tree.component';
import { PageModule } from './page.module';


export function registerPageModule() {
    AngularCms.registerModule({
        module: PageModule,
        roots: [
            {
                name: CmsModuleRoot.Editor,
                routes: [
                    {
                        path: 'new/page',
                        component: ContentTypeListComponent
                    },
                    {
                        path: 'new/page/:parentId',
                        component: ContentTypeListComponent
                    },
                    {
                        path: 'content/page/:id',
                        component: ContentFormEditComponent
                    }
                ],
                widgets: [
                    {
                        component: PageTreeComponent,
                        position: CmsWidgetPosition.Left,
                        group: 'Pages'
                    }
                ]
            },
            {
                name: CmsModuleRoot.Admin,
                widgets: [
                    {
                        component: PageTreeReadonlyComponent,
                        position: CmsWidgetPosition.Right,
                        group: 'Pages'
                    }
                ]
            }
        ]

    })
}