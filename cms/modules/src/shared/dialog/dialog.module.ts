import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TreeModule } from '../tree';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ContentDialogComponent } from './content-dialog.component';
import { DialogService } from './dialog.service';
import { MediaListComponent, MediaTreeDialogComponent } from './media-dialog.component';
import { PageTreeDialogComponent } from './page-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        CoreModule,
        TreeModule
    ],
    declarations: [
        ConfirmationDialogComponent,
        ContentDialogComponent,
        MediaTreeDialogComponent,
        MediaListComponent,
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
