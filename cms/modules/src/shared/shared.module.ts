import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBars, faCaretDown, faCaretRight, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { CoreModule, DndModule } from '@angular-cms/core';

import { CmsBsDropdownModule } from './ngx-bootstrap/bs-dropdown.module';
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
        FontAwesomeModule,

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
export class SharedModule {
    constructor(private library: FaIconLibrary) {
        library.addIcons(faBars, faCaretDown, faCaretRight, faMinusSquare, faPlusSquare);
    }
}
