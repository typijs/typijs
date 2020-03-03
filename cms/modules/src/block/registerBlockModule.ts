import { CmsModuleRoot, CmsWidgetPosition, registerModule } from '@angular-cms/core';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
import { BlockTreeComponent } from './block-tree.component';
import { BlockModule } from './block.module';

export function registerBlockModule() {
    registerModule({
        module: BlockModule,
        roots: [
            {
                name: CmsModuleRoot.Editor,
                routes: [
                    {
                        path: 'new/block',
                        component: ContentTypeListComponent
                    },
                    {
                        path: 'new/block/:parentId',
                        component: ContentTypeListComponent
                    },
                    {
                        path: 'content/block/:id',
                        component: ContentFormEditComponent
                    }
                ],
                widgets: [
                    {
                        component: BlockTreeComponent,
                        position: CmsWidgetPosition.Right,
                        group: "Blocks"
                    }
                ]
            }
        ]
    })
}