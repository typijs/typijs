import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CrudModule } from '../shared/crud/crud.module';
import { ContentTypeListMenu } from './content-type-list';
import { ContentTypePropertiesComponent } from './content-type-properties';
import { Routes, RouterModule } from '@angular/router';
import { ADMIN_ROUTES, ADMIN_WIDGETS, CmsWidgetPosition, CoreModule } from '@angular-cms/core';

const contentTypeRoutes: Routes = [
    { path: `content-type/page/:name`, component: ContentTypePropertiesComponent },
    { path: `content-type/block/:name`, component: ContentTypePropertiesComponent },
    { path: `content-type/media/:name`, component: ContentTypePropertiesComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CoreModule,
        CrudModule
    ],
    entryComponents: [ContentTypePropertiesComponent, ContentTypeListMenu],
    declarations: [ContentTypePropertiesComponent, ContentTypeListMenu]
})
export class ContentTypeModule {
    static forRoot(): ModuleWithProviders<ContentTypeModule> {
        return {
            ngModule: ContentTypeModule,
            providers: [
                { provide: ADMIN_ROUTES, useValue: contentTypeRoutes, multi: true },
                {
                    provide: ADMIN_WIDGETS, useValue: [
                        {
                            component: ContentTypeListMenu,
                            position: CmsWidgetPosition.Left,
                            group: 'Content Type'
                        }
                    ],
                    multi: true
                }
            ]
        };
    }
}
