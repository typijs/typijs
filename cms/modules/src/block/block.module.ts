import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '@angular-cms/core';

import { SharedModule } from '../shared/shared.module';
import { BlockComponent } from './block.component';

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
        BlockComponent
    ],
    entryComponents: [
        BlockComponent
    ],
    exports: [
        BlockComponent
    ]
})
export class BlockModule { }
