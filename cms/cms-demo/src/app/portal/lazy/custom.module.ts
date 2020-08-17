import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CmsWidgetPosition, ADMIN_ROUTES, ADMIN_WIDGETS } from '@angular-cms/core';
import { CustomEntryComponent, CustomComponent } from './custom.component';

const customRoutes: Routes = [
    {
        path: 'test-custom',
        component: CustomComponent,
    },
    {
        path: 'test-lazy',
        loadChildren: () => import('./lazy.module').then(m => m.LazyModule)
    }
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        CustomEntryComponent,
        CustomComponent
    ],
    entryComponents: [
        CustomEntryComponent,
        CustomComponent
    ]
})
export class CustomModule {
    public static forRoot(): ModuleWithProviders<CustomModule> {
        return {
            ngModule: CustomModule,
            providers: [
                { provide: ADMIN_ROUTES, useValue: customRoutes, multi: true },
                {
                    provide: ADMIN_WIDGETS, useValue: [
                        {
                            component: CustomEntryComponent,
                            position: CmsWidgetPosition.Left,
                            group: 'Test'
                        }
                    ],
                    multi: true
                }
            ]
        }
    }
}
