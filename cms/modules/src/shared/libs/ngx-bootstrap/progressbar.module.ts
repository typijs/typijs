import { NgModule, ModuleWithProviders } from '@angular/core';

import { ProgressbarModule, ProgressbarConfig } from 'ngx-bootstrap/progressbar';

@NgModule({
    exports: [ProgressbarModule]
})
export class CmsProgressbarModule {
    static forRoot(): ModuleWithProviders<ProgressbarModule> {
        return {
            ngModule: ProgressbarModule,
            providers: [ProgressbarConfig]
        };
    }
}