import { CmsWidgetPosition, CoreModule, EDITOR_ROUTES, EDITOR_WIDGETS } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSplitModule } from 'angular-split';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ContentUpdateComponent } from '../content/content-update/content-update.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';
import { MediaTreeComponent } from './media-tree.component';
import { DragLeaveDirective } from './upload/drag-leave.directive';
import { DragOverDirective } from './upload/drag-over.directive';
import { FileDropComponent } from './upload/file-drop.component';
import { FileModalComponent } from './upload/file-modal.component';
import { FileSelectDirective } from './upload/file-select.directive';
import { UploadService } from './upload/upload.service';

const mediaRoutes: Routes = [
    { path: 'content/media/:id', component: ContentUpdateComponent }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,

        AngularSplitModule,
        BsDropdownModule,
        ProgressbarModule,
        ModalModule,

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
    ]
})
export class MediaModule {
    static forRoot(): ModuleWithProviders<MediaModule> {
        return {
            ngModule: MediaModule,
            providers: [
                UploadService,
                { provide: EDITOR_ROUTES, useValue: mediaRoutes, multi: true },
                {
                    provide: EDITOR_WIDGETS, useValue: {
                        group: 'Media',
                        position: CmsWidgetPosition.Right,
                        component: MediaTreeComponent,
                        order: 10
                    },
                    multi: true
                }
            ]
        };
    }
}
