import { CmsUrl } from '@angular-cms/core';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CmsListControl } from '../cms-list.control';
import { UrlDetailsComponent } from '../url/url-details.component';

const URL_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UrlListControl),
    multi: true
};

@Component({
    selector: 'url-list',
    template: `
        <cms-sortable [items]="model" (itemSorted)="itemSorted($event)">
            <ng-template #itemTemplate let-item>
                <div class="d-flex align-items-center" >
                        <fa-icon class="mr-1" [icon]="['fas', 'hashtag']"></fa-icon>
                        <div class="mr-2">
                            <span>{{item.text}}</span>
                        </div>
                        <div class="hover-menu ml-auto" dropdown container="body">
                            <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                            <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right"
                                *dropdownMenu>
                                <a class="dropdown-item p-2" href="javascript:void(0)" (click)="openUrlDetailsModal(item)">
                                    Edit
                                </a>
                                <a class="dropdown-item p-2" href="javascript:void(0)" (click)="removeItem(item.guid)">
                                    Remove
                                </a>
                            </div>
                        </div>
                    </div>
            </ng-template>

            <ng-template #placeholderTemplate>
                <a href="javascript:void(0)" (click)="openUrlDetailsModal()">
                    Add Url
                </a>
            </ng-template>
        </cms-sortable>
    `,
    // To isolate drop area of element, provide the separate instance of DndService for this element
    providers: [URL_LIST_VALUE_ACCESSOR]
})
export class UrlListControl extends CmsListControl {

    constructor(private modalService: BsModalService) {
        super();
    }

    openUrlDetailsModal(item?: CmsUrl) {
        const initialState = {
            urlData: item ?? <CmsUrl>{},
            title: item ? 'Edit url' : 'Create url'
        };
        const config: ModalOptions<UrlDetailsComponent> = {
            initialState,
            backdrop: true, // Show backdrop
            keyboard: false, // Esc button option
            ignoreBackdropClick: true, // Backdrop click to hide,
            animated: false,
            class: 'modal-md'
        };

        this.modalService.show(UrlDetailsComponent, config).content.getResult().subscribe(editedItem => {
            this.insertOrUpdateItem(editedItem);
        });
    }
}
