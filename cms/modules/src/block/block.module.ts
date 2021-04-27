import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CmsWidgetPosition, EDITOR_ROUTES, EDITOR_WIDGETS } from '@typijs/core';
import { AngularSplitModule } from 'angular-split';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CONTENT_VERSION_SERVICES } from '../content-version/content-version.service';
import { ContentCreateComponent } from '../content/content-create/content-create.component';
import { CONTENT_CRUD_SERVICES } from '../content/content-crud.service';
import { ContentUpdateComponent } from '../content/content-update/content-update.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';
import { BlockCrudService } from './block-crud.service';
import { BlockTreeComponent } from './block-tree.component';
import { BlockVersionService } from './block-version.service';


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
        AngularSplitModule,
        BsDropdownModule,
        TreeModule,
        DndModule
    ],
    declarations: [
        BlockTreeComponent
    ]
})
export class BlockModule {
    static forRoot(): ModuleWithProviders<BlockModule> {
        return {
            ngModule: BlockModule,
            providers: [
                { provide: CONTENT_CRUD_SERVICES, useClass: BlockCrudService, multi: true },
                { provide: CONTENT_VERSION_SERVICES, useClass: BlockVersionService, multi: true },
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
