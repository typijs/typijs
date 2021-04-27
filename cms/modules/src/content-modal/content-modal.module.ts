import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CoreModule } from '@typijs/core';
import { CmsModalModule } from '../shared/modal/modal.module';
import { TreeModule } from '../shared/tree/tree.module';
import { ContentModalService } from './content-modal.service';
import { MediaListComponent, MediaTreeModalComponent } from './media-modal.component';
import { PageTreeModalComponent } from './page-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        CmsModalModule,
        CoreModule,
        TreeModule
    ],
    declarations: [
        MediaTreeModalComponent,
        MediaListComponent,
        PageTreeModalComponent,
    ]
})
export class ContentModalModule {
    static forRoot(): ModuleWithProviders<ContentModalModule> {
        return {
            ngModule: ContentModalModule,
            providers: [ContentModalService]
        };
    }
}
