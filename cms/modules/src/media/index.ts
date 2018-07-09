import { registerModule, CmsRootModule, CmsWidgetPosition } from '@angular-cms/core';
import { MediaModule } from './media.module';
import { MediaTreeComponent } from './media-tree.component';

export function registerMediaModule() {
    registerModule({
        module: MediaModule,
        root: CmsRootModule.Editor,
        widgets: [
            {
                component: MediaTreeComponent,
                position: CmsWidgetPosition.Right,
                group: "Medias"
            }
        ]
    })
}