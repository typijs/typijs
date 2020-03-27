import { NgModule } from '@angular/core';

import { PreviewComponent } from './preview.component';
import { PreviewRoutingModule } from './preview.routing';
import { PagePreviewComponent } from './page-preview.component';
import { BlockPreviewComponent } from './block-preview.component';

@NgModule({
    imports: [
        PreviewRoutingModule
    ],
    exports: [],
    declarations: [
        PreviewComponent,
        BlockPreviewComponent,
        PagePreviewComponent
    ],
    providers: [],
})
export class PreviewModule { }
