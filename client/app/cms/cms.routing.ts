
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const cmsRoutes: Routes = [
    {
        
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(cmsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CmsRoutingModule { }