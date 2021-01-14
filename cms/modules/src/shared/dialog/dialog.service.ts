import { ContentReference, CmsImage } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { PageTreeDialogComponent } from './page-dialog.component';

@Injectable()
export class DialogService {

    constructor(private modalService: BsModalService) { }

    confirm(
        title: string,
        message: string,
        btnYesText: string = 'Yes',
        btnNoText: string = 'No'): Observable<boolean> {
        const config: ModalOptions = {
            initialState: { title, message, btnYesText, btnNoText },
            animated: false,
            class: 'modal-md'
        }

        const modalRef = this.modalService.show(ConfirmationDialogComponent, config);

        return modalRef.content.getResult();
    }

    openPageDialog(selectedContentId: string): Observable<ContentReference> {
        const config: ModalOptions = {
            initialState: { selectedContentId },
            animated: false,
            class: 'modal-md'
        }

        const modalRef = this.modalService.show(PageTreeDialogComponent, config);

        return modalRef.content.getResult();
    }

}
