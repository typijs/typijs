import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCaretDown, faCaretRight, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DndModule } from '../drag-drop/dnd.module';
import { TreeChildrenComponent } from './components/tree-children.component';
import { TreeNodeComponent } from './components/tree-node.component';
import { TreeComponent } from './components/tree.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        BsDropdownModule,

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
    constructor(library: FaIconLibrary) {
        library.addIcons(faBars, faCaretDown, faCaretRight, faMinusSquare, faPlusSquare);
    }
}
