import { ADMIN_WIDGETS, CmsWidgetPosition, CoreModule, EDITOR_ROUTES, EDITOR_WIDGETS } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faPlus, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { ContentUpdateComponent } from '../content/content-update/content-update.component';
import { CONTENT_CRUD_SERVICES } from '../content/content-crud.service';
import { ContentCreateComponent } from '../content/content-create/content-create.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';
import { PageCrudService } from './page-crud.service';
import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { PageTreeComponent } from './page-tree.component';
import { CONTENT_VERSION_SERVICES } from '../content-version/content-version.service';
import { PageVersionService } from './page-version.service';

const pageRoutes: Routes = [
    { path: `new/page`, component: ContentCreateComponent },
    { path: `new/page/:parentId`, component: ContentCreateComponent },
    { path: `content/page/:id`, component: ContentUpdateComponent }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        FontAwesomeModule,

        CoreModule,
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
    ]
})
export class PageModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faFolder, faSitemap, faFile, faPlus);
    }

    static forRoot(): ModuleWithProviders<PageModule> {
        return {
            ngModule: PageModule,
            providers: [
                { provide: CONTENT_CRUD_SERVICES, useClass: PageCrudService, multi: true },
                { provide: CONTENT_VERSION_SERVICES, useClass: PageVersionService, multi: true },
                { provide: EDITOR_ROUTES, useValue: pageRoutes, multi: true },
                {
                    provide: EDITOR_WIDGETS, useValue: { group: 'Pages', position: CmsWidgetPosition.Left, component: PageTreeComponent, order: 10 },
                    multi: true
                },
                {
                    provide: ADMIN_WIDGETS, useValue: { group: 'Pages', position: CmsWidgetPosition.Right, component: PageTreeReadonlyComponent, order: 10 },
                    multi: true
                }
            ]
        };
    }
}
