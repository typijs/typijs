import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';


import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable()
export class DialogService {

    constructor(private modalService: BsModalService) { }

    public confirm(
        title: string,
        message: string,
        btnYesText: string = 'Yes',
        btnNoText: string = 'No'): Observable<boolean> {
        const config: ModalOptions = {
            initialState: { title, message, btnYesText, btnNoText },
            animated: false
        }

        const modalRef = this.modalService.show(ConfirmationDialogComponent, config);

        return modalRef.content.getResult();
    }
}
