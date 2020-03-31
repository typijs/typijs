import { NgModule, ModuleWithProviders } from '@angular/core';

import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
    exports: [ButtonsModule]
})
export class CmsButtonsModule {
    static forRoot(): ModuleWithProviders<ButtonsModule> {
        return {
            ngModule: ButtonsModule,
            providers: []
        };
    }
}