import { ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { SubscriptionComponent } from './subscription.component';


export abstract class ModalComponent extends SubscriptionComponent {
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

        this.subscriptions.push(
            this.modalService.onShow.subscribe((reason: string) => {
                this.isModalShown = true;
            })
        );

        this.subscriptions.push(
            this.modalService.onHidden.subscribe((reason: string) => {
                this.isModalShown = false;
            })
        );
    }

    showModal() {
        this.modalRef = this.modalService.show(this.modalTemplate, this.config);
    }

    hideModal() {
        this.modalRef.hide()
    }
}