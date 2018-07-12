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
import { FileUploadComponent } from './file-upload.component';
import { UploadService } from './upload.service';
import { DropZoneDirective } from './drop-zone.directive';
import { DragOverDirective } from './drag-over.directive';
import { DragLeaveDirective } from './drag-leave.directive';

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
        FileUploadComponent,
        DropZoneDirective,
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
