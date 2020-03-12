import { NgModule, ModuleWithProviders } from '@angular/core';

import { PositioningService } from 'ngx-bootstrap/positioning';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

@NgModule()
export class CmsModalModule {
    static forRoot(): ModuleWithProviders<ModalModule> {
        return {
            ngModule: ModalModule,
            providers: [BsModalService, ComponentLoaderFactory, PositioningService]
        };
    }
    static forChild(): ModuleWithProviders<ModalModule> {
        return {
            ngModule: ModalModule,
            providers: [BsModalService, ComponentLoaderFactory, PositioningService]
        };
    }
}