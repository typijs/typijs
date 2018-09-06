import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { CoreModule, DndModule } from '@angular-cms/core';

import { SharedModule } from '../shared/shared.module';
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
        CoreModule,
        SharedModule,
        RouterModule,
        DndModule.forRoot(),
        ProgressbarModule.forRoot()
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
export class MediaModule { }
