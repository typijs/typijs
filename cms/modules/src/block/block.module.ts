import { CmsWidgetPosition, EDITOR_ROUTES, EDITOR_WIDGETS } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCube, faCubes, faFolder, faFolderPlus, faPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { CONTENT_FORM_SERVICES } from '../content/content-form.service';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { CmsAngularSplitModule } from '../shared/libs/angular-split/module';
import { CmsBsDropdownModule } from '../shared/libs/ngx-bootstrap/bs-dropdown.module';
import { TreeModule } from '../shared/tree/tree.module';
import { BlockFormService } from './block-form.service';
import { BlockTreeComponent } from './block-tree.component';


const blockRoutes: Routes = [
    { path: `new/block`, component: ContentTypeListComponent },
    { path: `new/block/:parentId`, component: ContentTypeListComponent },
    { path: `content/block/:id`, component: ContentFormEditComponent }
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
                { provide: CONTENT_FORM_SERVICES, useClass: BlockFormService, multi: true },
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
