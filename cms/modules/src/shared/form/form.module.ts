import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../form/dynamic-form.component';
import { DynamicFormService } from './dynamic-form.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        CoreModule
    ],
    declarations: [
        DynamicFormComponent
    ],
    exports: [
        DynamicFormComponent
    ]
})
export class CmsFormModule {
    static forRoot(): ModuleWithProviders<CmsFormModule> {
        return {
            ngModule: CmsFormModule,
            providers: [
                DynamicFormService
            ]
        };
    }
}
