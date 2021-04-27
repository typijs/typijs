import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CmsUrl } from '@typijs/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CmsControl } from '../cms-control';
import { UrlDetailsComponent } from './url-details.component';

const URL_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UrlControl),
    multi: true
};

@Component({
    selector: 'url-picker',
    template: `
    <div class="d-flex align-items-center">
        <div class="content-reference border w-100 mr-1">
            <div class="p-1 drop-area">
                <div class="d-flex align-items-center p-1 bg-light rounded" *ngIf="model">
                    <fa-icon class="mr-1" [icon]="['fas', 'file']"></fa-icon>
                    <div class="w-100 mr-2 text-truncate">{{model.text}}</div>
                    <fa-icon class="ml-auto mr-1" [icon]="['fas', 'times']" (click)="removeUrl()"></fa-icon>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary ml-auto" (click)="openUrlDialog()">...</button>
    </div>
    `,
    styles: [`
        .content-reference .drop-area {
            min-height: 38.5px;
        }
    `],
    providers: [URL_PICKER_VALUE_ACCESSOR]
})
export class UrlControl extends CmsControl {
    model: CmsUrl;
    constructor(private modalService: BsModalService) {
        super();
    }

    writeValue(value: CmsUrl): void {
        this.model = value;
    }

    removeUrl() {
        this.model = null;
        this.onChange(this.model);
    }

    openUrlDialog() {
        const initialState = {
            urlData: this.model ?? <CmsUrl>{},
            title: this.model ? 'Edit url' : 'Create url'
        };
        const config: ModalOptions<UrlDetailsComponent> = {
            initialState,
            backdrop: true, // Show backdrop
            keyboard: false, // Esc button option
            ignoreBackdropClick: true, // Backdrop click to hide,
            animated: false,
            class: 'modal-md'
        };

        this.modalService.show(UrlDetailsComponent, config).content.getResult().subscribe((url: CmsUrl) => {
            this.model = url;
            this.onChange(this.model);
        });
    }
}
