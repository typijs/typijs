import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '@angular-cms/core';

import { TreeStore } from './content-tree/tree-store';
import { ContentTreeComponent } from './content-tree/content-tree.component';

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
        ContentTreeComponent
    ],
    exports: [
        ContentTreeComponent
    ],
    providers: [TreeStore]
})
export class SharedModule { }
