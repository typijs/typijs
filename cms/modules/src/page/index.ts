import { registerModule, CmsRootModule, CmsWidgetPosition } from '@angular-cms/core';
import { PageModule } from './page.module';
import { PageTreeComponent } from './page-tree.component';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';


export function registerPageModule() {
    registerModule({
        module: PageModule,
        root: CmsRootModule.Editor,
        routes: [
            {
                path: 'new/:type', //type is 'block' or 'page'
                component: ContentTypeListComponent
            },
            {
                path: 'new/:type/:parentId', //type is 'block' or 'page'
                component: ContentTypeListComponent
            },
            {
                path: 'content/:type/:id', //type is 'block' or 'page'
                component: ContentFormEditComponent
            }
        ],
        widgets: [
            {
                component: PageTreeComponent,
                position: CmsWidgetPosition.Right,
                group: 'Pages'
            }
        ]
    })
}