import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './pages/shared/layout/layout.component';

const appRoutes: Routes = [
  // { path: '', component: HomeComponent },
  {
    path: 'cms',
    loadChildren: '@angular-cms/portal/src/cms.module#CmsModule',
  },
  { path: '**', component: LayoutComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }