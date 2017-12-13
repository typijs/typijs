import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'cms',
    loadChildren: 'app/cms/cms.module#CmsModule',
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