import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '@angular-cms/core';

import { TreeStore } from './tree/tree-store';
import { TreeComponent } from './tree/tree.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        RouterModule
    ],
    declarations: [
        TreeComponent
    ],
    exports: [
        TreeComponent
    ],
    providers: [TreeStore]
})
export class SharedModule { }
