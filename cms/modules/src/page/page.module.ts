import { ADMIN_WIDGETS, CmsWidgetPosition, CoreModule, EDITOR_ROUTES, EDITOR_WIDGETS } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faPlus, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { CONTENT_FORM_SERVICES } from '../content/content-form.service';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';
import { PageFormService } from './page-form.service';
import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { PageTreeComponent } from './page-tree.component';

const pageRoutes: Routes = [
    { path: `new/page`, component: ContentTypeListComponent },
    { path: `new/page/:parentId`, component: ContentTypeListComponent },
    { path: `content/page/:id`, component: ContentFormEditComponent }
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
                { provide: CONTENT_FORM_SERVICES, useClass: PageFormService, multi: true },
                { provide: EDITOR_ROUTES, useValue: pageRoutes, multi: true },
                {
                    provide: EDITOR_WIDGETS, useValue: { group: 'Pages', position: CmsWidgetPosition.Left, component: PageTreeComponent, order: 2 },
                    multi: true
                },
                {
                    provide: ADMIN_WIDGETS, useValue: { group: 'Pages', position: CmsWidgetPosition.Right, component: PageTreeReadonlyComponent },
                    multi: true
                }
            ]
        };
    }
}
