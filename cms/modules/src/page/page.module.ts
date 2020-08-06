import { AngularCms, CmsModuleRoot, CmsRootConfig, CmsWidgetPosition, CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faPlus, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { ContentFormEditComponent } from '../content/content-form-edit/content-form-edit.component';
import { ContentTypeListComponent } from '../content/content-type-list/content-type-list.component';
import { ContentModule } from '../content/content.module';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';
import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { PageTreeComponent } from './page-tree.component';

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
        AngularCms.registerModule({
            module: PageModule,
            roots: [
                {
                    name: CmsModuleRoot.Editor,
                    widgets: [
                        {
                            component: PageTreeComponent,
                            position: CmsWidgetPosition.Left,
                            group: 'Pages'
                        }
                    ]
                },
                {
                    name: CmsModuleRoot.Admin,
                    widgets: [
                        {
                            component: PageTreeReadonlyComponent,
                            position: CmsWidgetPosition.Right,
                            group: 'Pages'
                        }
                    ]
                }
            ]

        })
    }
}

export const pageModuleConfig: CmsRootConfig[] = [
    {
        name: CmsModuleRoot.Editor,
        routes: [
            {
                path: 'new/page',
                component: ContentTypeListComponent
            },
            {
                path: 'new/page/:parentId',
                component: ContentTypeListComponent
            },
            {
                path: 'content/page/:id',
                component: ContentFormEditComponent
            }
        ]
    }
]
