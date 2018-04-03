import { registerModule, CmsRootModule, CmsWidgetPosition } from '@angular-cms/core';
import { BlockModule } from './block.module';
import { BlockComponent } from './block.component';


export function registerBlockModule() {
    registerModule({
        module: BlockModule,
        root: CmsRootModule.Editor,
        widgets: [
            {
                component: BlockComponent,
                position: CmsWidgetPosition.Right,
            }
        ]
    })
}