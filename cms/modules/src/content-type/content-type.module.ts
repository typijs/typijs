import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ADMIN_ROUTES, ADMIN_WIDGETS, CmsWidgetPosition, CoreModule } from '@typijs/core';
import { CmsTableModule } from '../shared/table/table.module';
import { ContentTypeDetailComponent } from './content-type-detail.component';
import { ContentTypeListComponent } from './content-type-list.component';

const contentTypeRoutes: Routes = [
    { path: `content-type/page/:name`, component: ContentTypeDetailComponent },
    { path: `content-type/block/:name`, component: ContentTypeDetailComponent },
    { path: `content-type/media/:name`, component: ContentTypeDetailComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CoreModule,
        CmsTableModule
    ],
    declarations: [ContentTypeDetailComponent, ContentTypeListComponent]
})
export class ContentTypeModule {
    static forRoot(): ModuleWithProviders<ContentTypeModule> {
        return {
            ngModule: ContentTypeModule,
            providers: [
                { provide: ADMIN_ROUTES, useValue: contentTypeRoutes, multi: true },
                {
                    provide: ADMIN_WIDGETS, useValue: {
                        component: ContentTypeListComponent,
                        position: CmsWidgetPosition.Left,
                        group: 'Content Type',
                        order: 10
                    },
                    multi: true
                }
            ]
        };
    }
}
