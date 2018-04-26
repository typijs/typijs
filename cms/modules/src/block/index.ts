import { registerModule, CmsRootModule, CmsWidgetPosition } from '@angular-cms/core';
import { BlockModule } from './block.module';
import { BlockTreeComponent } from './block-tree.component';

export function registerBlockModule() {
    registerModule({
        module: BlockModule,
        root: CmsRootModule.Editor,
        widgets: [
            {
                component: BlockTreeComponent,
                position: CmsWidgetPosition.Right,
            }
        ]
    })
}