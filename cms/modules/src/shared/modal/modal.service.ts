import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from './confirmation-modal.component';

@Injectable()
export class CmsModalService {

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

        const modalRef = this.modalService.show(ConfirmationModalComponent, config);

        return modalRef.content.getResult();
    }
}
