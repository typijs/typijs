import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TreeModule } from '../tree';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ContentDialogComponent } from './content-dialog.component';
import { DialogService } from './dialog.service';
import { PageTreeDialogComponent } from './page-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        TreeModule
    ],
    declarations: [
        ConfirmationDialogComponent,
        ContentDialogComponent,
        PageTreeDialogComponent,
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
