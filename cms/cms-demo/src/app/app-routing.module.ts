import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularCmsModule } from '@angular-cms/core';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path: 'cms',
    loadChildren: './shared/portal/portal.module#PortalModule'
  }
]
//fix for error: Angular CLI ERROR in Cannot read property 'loadChildren' of null
routes.push(...AngularCmsModule.registerCmsRoutes(LayoutComponent));

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
