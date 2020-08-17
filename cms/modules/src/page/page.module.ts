import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faPlus, faSitemap } from '@fortawesome/free-solid-svg-icons';

import { CmsWidgetPosition, CoreModule, EDITOR_ROUTES, EDITOR_WIDGETS, ADMIN_WIDGETS } from '@angular-cms/core';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
import { ContentModule } from '../content/content.module';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';
import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { PageTreeComponent } from './page-tree.component';

const pageRoutes: Routes = [
    { path: 'new/page', component: ContentTypeListComponent },
    { path: 'new/page/:parentId', component: ContentTypeListComponent },
    { path: 'content/page/:id', component: ContentFormEditComponent }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        FontAwesomeModule,

        CoreModule,
        ContentModule,
        TreeModule,
        DndModule
    ],
    declarations: [
        PageTreeComponent,
        PageTreeReadonlyComponent
    ],
    entryComponents: [
        PageTreeComponent,
        PageTreeReadonlyComponent
    ],
    exports: [
        PageTreeComponent,
        PageTreeReadonlyComponent
    ]
})
export class PageModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faFolder, faSitemap, faFile, faPlus);
    }

    public static forRoot(): ModuleWithProviders<PageModule> {
        return {
            ngModule: PageModule,
            providers: [
                { provide: EDITOR_ROUTES, useValue: pageRoutes, multi: true },
                {
                    provide: EDITOR_WIDGETS, useValue: [
                        { group: 'Pages', position: CmsWidgetPosition.Left, component: PageTreeComponent }
                    ],
                    multi: true
                },
                {
                    provide: ADMIN_WIDGETS, useValue: [
                        { group: 'Pages', position: CmsWidgetPosition.Right, component: PageTreeReadonlyComponent }
                    ],
                    multi: true
                }
            ]
        }
    }
}
