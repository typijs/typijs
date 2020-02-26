import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularCmsModule, CmsRenderContentComponent } from '@angular-cms/core';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path: 'cms',
    loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '**',
        data: { reuse: false }, //pass reuse param to CustomRouteReuseStrategy
        component: CmsRenderContentComponent,
      }
    ]
  }
]

//temporary comment since this way don't working with Angular Universal
//fix for error: Angular CLI ERROR in Cannot read property 'loadChildren' of null
//AngularCmsModule.registerCmsRoutes(LayoutComponent).forEach(x => routes.push(x))
//routes.push(...AngularCmsModule.registerCmsRoutes(LayoutComponent));

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
