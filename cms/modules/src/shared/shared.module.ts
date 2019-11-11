import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CmsBsDropdownModule } from './ngx-bootstrap/bs-dropdown.module';

import { CoreModule, DndModule } from '@angular-cms/core';

import { TreeComponent } from './tree/tree.component';
import { TreeChildrenComponent } from './tree/tree-children.component';
import { TreeNodeComponent } from './tree/tree-node.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CoreModule,
        DndModule,
        CmsBsDropdownModule.forRoot()
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
