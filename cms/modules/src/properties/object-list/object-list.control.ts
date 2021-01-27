import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DndService } from '../../shared/drag-drop/dnd.service';
import { CmsListControl } from '../cms-list.control';
import { ObjectDetailsComponent } from './object-details.component';

const OBJECT_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ObjectListControl),
    multi: true
};

@Component({
    selector: 'object-list',
    template: `
        <cms-sortable [items]="model" (itemSorted)="itemSorted($event)">
            <ng-template #itemTemplate let-item>
                <div class="d-flex align-items-center">
                    <fa-icon class="mr-1" [icon]="['fas', 'hashtag']"></fa-icon>
                    <div *ngFor="let field of getItems(item)" class="mr-2">
                        <span>{{field.value}}</span>
                    </div>
                    <div class="hover-menu ml-auto" dropdown container="body">
                        <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                        <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right"
                            *dropdownMenu>
                            <a class="dropdown-item p-2" href="javascript:void(0)" (click)="openObjectDetailsModal(item)">
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
                <a href="javascript:void(0)" (click)="openObjectDetailsModal()">
                    Add Item
                </a>
            </ng-template>
        </cms-sortable>
    `,
    styles: [`
        .content-area .list-group{
            min-height: 80px;
        }
    `],
    // To isolate drop area of element, provide the separate instance of DndService for this element
    providers: [OBJECT_LIST_VALUE_ACCESSOR, DndService]
})
export class ObjectListControl extends CmsListControl {
    @Input() itemType: new () => any;

    constructor(private modalService: BsModalService) {
        super();
    }

    openObjectDetailsModal(item?: { [key: string]: any }) {
        const initialState = {
            itemType: this.itemType,
            itemData: item ?? {},
            title: item ? 'Item Detail' : 'Create Item'
        }
        const config: ModalOptions = {
            initialState,
            backdrop: true, // Show backdrop
            keyboard: false, // Esc button option
            ignoreBackdropClick: true, // Backdrop click to hide,
            animated: false,
            class: 'modal-md'
        }

        this.modalService.show(ObjectDetailsComponent, config).content.getResult().subscribe(editedItem => {
            this.insertOrUpdateItem(editedItem);
        });
    }

    getItems(control): any[] {
        const items = Object.keys(control).filter(key => key !== 'guid').map(key => ({
            key,
            value: control[key]
        }));

        return items;
    }
}
