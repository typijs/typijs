import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { AngularCms } from '@angular-cms/core';
import { TestComponent } from './test.component';

const appRoutes: Routes = [
  ...AngularCms.registerCmsRoutes(LayoutComponent)
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