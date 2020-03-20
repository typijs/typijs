import { ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';

import { PositioningService } from 'ngx-bootstrap/positioning';
import {
    BsDropdownConfig,
    BsDropdownState,
    BsDropdownModule
} from 'ngx-bootstrap/dropdown';

@NgModule({
    exports: [BsDropdownModule]
})
export class CmsBsDropdownModule {
    // tslint:disable-next-line:no-any
    static forRoot(config?: any): ModuleWithProviders<BsDropdownModule> {
        return {
            ngModule: BsDropdownModule,
            providers: [
                ComponentLoaderFactory,
                PositioningService,
                BsDropdownState,
                {
                    provide: BsDropdownConfig,
                    useValue: config ? config : { autoClose: true, insideClick: false }
                }
            ]
        };
    }
}