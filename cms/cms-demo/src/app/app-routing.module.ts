import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmsPageRender } from '@typijs/core';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
    {
        path: 'typicms',
        loadChildren: () => import('./portal/portal.module').then(m => m.PortalModule)
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '**',
                data: { reuse: false }, // pass reuse param to CustomRouteReuseStrategy
                component: CmsPageRender,
            }
        ]
    }
];

// temporary comment since this way don't working with Angular Universal
// fix for error: Angular CLI ERROR in Cannot read property 'loadChildren' of null
// TypiJsModule.registerCmsRoutes(LayoutComponent).forEach(x => routes.push(x))
// routes.push(...TypiJsModule.registerCmsRoutes(LayoutComponent));

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
