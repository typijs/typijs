import { CmsWidgetPosition, CoreModule, EDITOR_ROUTES, EDITOR_WIDGETS } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContentUpdateComponent } from '../content/content-update/content-update.component';
import { CONTENT_CRUD_SERVICES } from '../content/content-crud.service';
import { ContentCreateComponent } from '../content/content-create/content-create.component';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';
import { PageCrudService } from './page-crud.service';
import { PageTreeComponent } from './page-tree.component';
import { CONTENT_VERSION_SERVICES } from '../content-version/content-version.service';
import { PageVersionService } from './page-version.service';
import { DefaultPageComponent } from './default-page.component';

const pageRoutes: Routes = [
    { path: '', component: DefaultPageComponent },
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
        DefaultPageComponent,
        PageTreeComponent,
    ]
})
export class PageModule {
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
                }
            ]
        };
    }
}
