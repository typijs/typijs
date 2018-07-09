import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule, DndModule } from '@angular-cms/core';

import { SharedModule } from '../shared/shared.module';
import { MediaTreeComponent } from './media-tree.component';
import { MediaTreeService } from './media-tree.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
        RouterModule,
        DndModule.forRoot()
    ],
    declarations: [
        MediaTreeComponent
    ],
    entryComponents: [
        MediaTreeComponent
    ],
    exports: [
        MediaTreeComponent
    ],
    providers: [MediaTreeService]
})
export class MediaModule { }
