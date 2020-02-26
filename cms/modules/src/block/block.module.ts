import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCubes, faFolder } from '@fortawesome/free-solid-svg-icons';

import { CoreModule } from '@angular-cms/core';

import { CmsAngularSplitModule } from '../shared/angular-split/module';
import { DndModule } from '../shared/dnd/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';

import { BlockTreeComponent } from './block-tree.component';
import { BlockTreeService } from './block-tree.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
        CoreModule,

        TreeModule,
        CmsAngularSplitModule.forRoot(),
        DndModule
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
export class BlockModule {
    constructor(private library: FaIconLibrary) {
        library.addIcons(faFolder, faCubes);
    }
}
