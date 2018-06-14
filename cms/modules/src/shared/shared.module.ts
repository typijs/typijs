import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CoreModule } from '@angular-cms/core';

import { TreeComponent } from './tree/tree.component';
import { TreeChildrenComponent } from './tree/tree-children.component';
import { TreeNodeComponent } from './tree/tree-node.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        BsDropdownModule.forRoot(),
        RouterModule
    ],
    declarations: [
        TreeNodeComponent,
        TreeChildrenComponent,
        TreeComponent
    ],
    exports: [
        TreeComponent
    ]
})
export class SharedModule { }
