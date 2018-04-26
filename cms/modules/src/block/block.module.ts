import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '@angular-cms/core';

import { SharedModule } from '../shared/shared.module';
import { BlockTreeComponent } from './block-tree.component';
import { BlockTreeService } from './block-tree.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        BlockTreeComponent
    ],
    entryComponents: [
        BlockTreeComponent
    ],
    exports: [
        BlockTreeComponent
    ],
    providers: [BlockTreeService]
})
export class BlockModule { }
