import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LazyComponent } from './lazy.component';

const lazyRoutes: Routes = [
    {
        path: '',
        component: LazyComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(lazyRoutes)],
    exports: [RouterModule]
})
export class LazyRoutingModule { }
