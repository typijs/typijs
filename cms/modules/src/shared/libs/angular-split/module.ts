import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularSplitModule } from 'angular-split';

@NgModule({
    exports: [AngularSplitModule]
})
export class CmsAngularSplitModule {
    static forRoot(): ModuleWithProviders<AngularSplitModule> {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }

    static forChild(): ModuleWithProviders<AngularSplitModule> {
        return {
            ngModule: AngularSplitModule,
            providers: []
        };
    }

}
