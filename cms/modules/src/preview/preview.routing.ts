
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewComponent } from './preview.component';
import { PagePreviewComponent } from './page-preview.component';
import { BlockPreviewComponent } from './block-preview.component';

const previewRoutes: Routes = [
    {
        path: '', component: PreviewComponent,
        children: [
            {
                path: 'page/:id',
                component: PagePreviewComponent
            },
            {
                path: 'block/:id',
                component: BlockPreviewComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(previewRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PreviewRoutingModule { }