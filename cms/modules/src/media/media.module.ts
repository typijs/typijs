import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFolder, faPhotoVideo } from '@fortawesome/free-solid-svg-icons';

import { CmsProgressbarModule } from '../shared/ngx-bootstrap/progressbar.module';

import { CoreModule } from '@angular-cms/core';

import { TreeModule } from '../shared/tree/tree.module';
import { AngularSplitModule } from '../shared/angular-split/angular-split.module';
import { DndModule } from '../shared/dnd/dnd.module';

import { MediaTreeComponent } from './media-tree.component';
import { MediaTreeService } from './media-tree.service';
import { FileDropComponent } from './upload/file-drop.component';
import { FileDialogComponent } from './upload/file-dialog.component'
import { UploadService } from './upload/upload.service';
import { DragOverDirective } from './upload/drag-over.directive';
import { DragLeaveDirective } from './upload/drag-leave.directive';

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
        AngularSplitModule,
        CmsProgressbarModule.forRoot()
    ],
    declarations: [
        MediaTreeComponent,
        FileDropComponent,
        FileDialogComponent,
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
