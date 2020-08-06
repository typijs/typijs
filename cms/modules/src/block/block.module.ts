import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCubes, faFolder, faCube, faFolderPlus, faPlusSquare, faBars, faPlus } from '@fortawesome/free-solid-svg-icons';

//import { CmsBsDropdownModule, CmsAngularSplitModule } from '../shared/libs';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsBsDropdownModule } from '../shared/libs/ngx-bootstrap/bs-dropdown.module';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';

import { BlockTreeComponent } from './block-tree.component';
import { CmsModuleRoot, CmsWidgetPosition, AngularCms } from '@angular-cms/core';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
        CmsAngularSplitModule,
        CmsBsDropdownModule,
        TreeModule,
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
    ]
})
export class BlockModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faFolder, faCubes, faCube, faFolderPlus, faPlusSquare, faBars, faPlus);
        AngularCms.registerModule({
            module: BlockModule,
            roots: [
                {
                    name: CmsModuleRoot.Editor,
                    routes: [
                        {
                            path: 'new/block',
                            component: ContentTypeListComponent
                        },
                        {
                            path: 'new/block/:parentId',
                            component: ContentTypeListComponent
                        },
                        {
                            path: 'content/block/:id',
                            component: ContentFormEditComponent
                        }
                    ],
                    widgets: [
                        {
                            component: BlockTreeComponent,
                            position: CmsWidgetPosition.Right,
                            group: "Blocks"
                        }
                    ]
                }
            ]
        })
    }
}
