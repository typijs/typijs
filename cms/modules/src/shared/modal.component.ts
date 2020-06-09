import { ViewChild, TemplateRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { SubscriptionDestroy } from './subscription-destroy';

export abstract class ModalComponent extends SubscriptionDestroy {
    @ViewChild('modalTemplate', { static: true }) modalTemplate: TemplateRef<any>;
    modalRef: BsModalRef;

    protected isModalShown: boolean = false;
    protected config: ModalOptions = {
        backdrop: true, //Show backdrop
        keyboard: false, //Esc button option
        ignoreBackdropClick: false //Backdrop click to hide
    };

    constructor(public modalService: BsModalService) {
        super();

        this.modalService.onShow
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((reason: string) => {
                this.isModalShown = true;
            });

        this.modalService.onHidden
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((reason: string) => {
                this.isModalShown = false;
            })
    }

    showModal() {
        this.modalRef = this.modalService.show(this.modalTemplate, this.config);
    }

    hideModal() {
        this.modalRef.hide()
    }
}