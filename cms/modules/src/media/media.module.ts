import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder, faFolderPlus, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';

import { CmsWidgetPosition, CoreModule, EDITOR_ROUTES, EDITOR_WIDGETS } from '@angular-cms/core';

import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
// import { CmsProgressbarModule, CmsModalModule, CmsAngularSplitModule } from '../shared/libs';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsModalModule } from '../shared/libs/ngx-bootstrap/modal.module';
import { CmsProgressbarModule } from '../shared/libs/ngx-bootstrap/progressbar.module';
import { TreeModule } from '../shared/tree/tree.module';
import { MediaTreeComponent } from './media-tree.component';
import { DragLeaveDirective } from './upload/drag-leave.directive';
import { DragOverDirective } from './upload/drag-over.directive';
import { FileDropComponent } from './upload/file-drop.component';
import { FileModalComponent } from './upload/file-modal.component';
import { FileSelectDirective } from './upload/file-select.directive';
import { UploadService } from './upload/upload.service';

const mediaRoutes: Routes = [
    { path: 'content/media/:id', component: ContentFormEditComponent }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,

        CmsAngularSplitModule,
        CmsProgressbarModule,
        CmsModalModule,

        TreeModule,
        DndModule,
        CoreModule
    ],
    declarations: [
        MediaTreeComponent,
        FileDropComponent,
        FileModalComponent,
        FileSelectDirective,
        DragOverDirective,
        DragLeaveDirective
    ],
    entryComponents: [
        MediaTreeComponent
    ]
})
export class MediaModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faFolder, faPhotoVideo, faFolderPlus);
    }

    static forRoot(): ModuleWithProviders<MediaModule> {
        return {
            ngModule: MediaModule,
            providers: [
                UploadService,
                { provide: EDITOR_ROUTES, useValue: mediaRoutes, multi: true },
                {
                    provide: EDITOR_WIDGETS, useValue: { group: 'Medias', position: CmsWidgetPosition.Right, component: MediaTreeComponent },
                    multi: true
                }
            ]
        };
    }
}
