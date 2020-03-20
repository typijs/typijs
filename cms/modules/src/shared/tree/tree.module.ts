import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBars, faCaretDown, faCaretRight, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { CoreModule } from '@angular-cms/core';
import { CmsBsDropdownModule } from '../libs';
import { DndModule } from '../drag-drop';

import { TreeNodeComponent } from './components/tree-node.component';
import { TreeChildrenComponent } from './components/tree-children.component';
import { TreeComponent } from './components/tree.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        CmsBsDropdownModule,

        CoreModule,
        DndModule
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
export class TreeModule {
    constructor(private library: FaIconLibrary) {
        library.addIcons(faBars, faCaretDown, faCaretRight, faMinusSquare, faPlusSquare);
    }
}
