import { NgModule, ModuleWithProviders } from '@angular/core';

import { TabsModule, TabsetConfig } from 'ngx-bootstrap/tabs';

@NgModule()
export class CmsTabsModule {
    static forRoot(): ModuleWithProviders<TabsModule> {
        return {
            ngModule: TabsModule,
            providers: [TabsetConfig]
        };
    }
}