import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularSplitModule } from 'angular-split';

@NgModule()
export class CmsAngularSplitModule {
    public static forRoot(): ModuleWithProviders<AngularSplitModule> {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }

    public static forChild(): ModuleWithProviders<AngularSplitModule> {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }

}
