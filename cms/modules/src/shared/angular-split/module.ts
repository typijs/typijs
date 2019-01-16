import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplitComponent } from './component/split.component';
import { SplitAreaDirective } from './directive/splitArea.directive';

/**
 * Used code from {@link https://github.com/bertrandg/angular-split}
 */
@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SplitComponent,
        SplitAreaDirective
    ],
    exports: [
        SplitComponent,
        SplitAreaDirective
    ]
})
export class AngularSplitModule {}
