import { NgModule, ModuleWithProviders } from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { DialogService } from './dialog.service';

@NgModule({
    declarations: [
        ConfirmationDialogComponent
    ]
})
export class DialogModule {
    static forRoot(): ModuleWithProviders<DialogModule> {
        return {
            ngModule: DialogModule,
            providers: [DialogService]
        };
    }
}
