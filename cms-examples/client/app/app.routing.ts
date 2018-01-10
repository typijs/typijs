import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';

const appRoutes: Routes = [
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