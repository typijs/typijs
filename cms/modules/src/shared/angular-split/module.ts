import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularSplitModule } from 'angular-split';

@NgModule()
export class CmsAngularSplitModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }

    public static forChild(): ModuleWithProviders {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }

}
