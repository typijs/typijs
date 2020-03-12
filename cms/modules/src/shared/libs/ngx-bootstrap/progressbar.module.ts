import { NgModule, ModuleWithProviders } from '@angular/core';

import { ProgressbarModule, ProgressbarConfig } from 'ngx-bootstrap/progressbar';

@NgModule()
export class CmsProgressbarModule {
    static forRoot(): ModuleWithProviders<ProgressbarModule> {
        return {
            ngModule: ProgressbarModule,
            providers: [ProgressbarConfig]
        };
    }
}