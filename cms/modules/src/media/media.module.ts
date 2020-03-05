import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';

import { CoreModule } from '@angular-cms/core';

import { DndModule } from '../shared/drag-drop/dnd.module';
import { CmsProgressbarModule } from '../shared/libs/ngx-bootstrap/progressbar.module';
import { CmsModalModule } from '../shared/libs/ngx-bootstrap/modal.module';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { TreeModule } from '../shared/tree/tree.module';

import { MediaTreeComponent } from './media-tree.component';
import { MediaTreeService } from './media-tree.service';
import { DragLeaveDirective } from './upload/drag-leave.directive';
import { DragOverDirective } from './upload/drag-over.directive';
import { FileModalComponent } from './upload/file-modal.component';
import { FileDropComponent } from './upload/file-drop.component';
import { UploadService } from './upload/upload.service';
import { FileSelectDirective } from './upload/file-select.directive';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        FontAwesomeModule,
        CoreModule,
        TreeModule,
        DndModule,
        CmsAngularSplitModule.forRoot(),
        CmsProgressbarModule.forRoot(),
        CmsModalModule.forRoot()
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
    ],
    exports: [
        MediaTreeComponent
    ],
    providers: [MediaTreeService, UploadService]
})
export class MediaModule {
    constructor(private library: FaIconLibrary) {
        library.addIcons(faFolder, faPhotoVideo);
    }
}
