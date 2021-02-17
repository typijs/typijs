import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CmsModalComponent } from './cms-modal.component';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { CmsModalService } from './modal.service';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule
    ],
    declarations: [
        ConfirmationModalComponent,
        CmsModalComponent
    ],
    exports: [
        CmsModalComponent
    ]
})
export class CmsModalModule {
    static forRoot(): ModuleWithProviders<CmsModalModule> {
        return {
            ngModule: CmsModalModule,
            providers: [CmsModalService]
        };
    }
}
