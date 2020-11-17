import { CmsWidgetPosition, EDITOR_ROUTES, EDITOR_WIDGETS } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCube, faCubes, faFolder, faFolderPlus, faPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { ContentUpdateComponent } from '../content/content-update/content-update.component';
import { CONTENT_CRUD_SERVICES } from '../content/content-crud.service';
import { ContentCreateComponent } from '../content/content-create/content-create.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsBsDropdownModule } from '../shared/libs/ngx-bootstrap/bs-dropdown.module';
import { TreeModule } from '../shared/tree/tree.module';
import { BlockCrudService } from './block-crud.service';
import { BlockTreeComponent } from './block-tree.component';


const blockRoutes: Routes = [
    { path: `new/block`, component: ContentCreateComponent },
    { path: `new/block/:parentId`, component: ContentCreateComponent },
    { path: `content/block/:id`, component: ContentUpdateComponent }
];

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
    ]
})
export class BlockModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faFolder, faCubes, faCube, faFolderPlus, faPlusSquare, faBars, faPlus);
    }

    static forRoot(): ModuleWithProviders<BlockModule> {
        return {
            ngModule: BlockModule,
            providers: [
                { provide: CONTENT_CRUD_SERVICES, useClass: BlockCrudService, multi: true },
                { provide: EDITOR_ROUTES, useValue: blockRoutes, multi: true },
                {
                    provide: EDITOR_WIDGETS, useValue: {
                        group: 'Blocks',
                        position: CmsWidgetPosition.Right,
                        component: BlockTreeComponent,
                        order: 10
                    },
                    multi: true
                }
            ]
        };
    }
}
