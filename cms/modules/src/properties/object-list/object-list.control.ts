import { generateUUID } from '@angular-cms/core';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { CmsControl } from '../cms-control';
import { ObjectDetailsComponent } from './object-details.component';
import { DndService } from '../../shared/drag-drop/dnd.service';

const OBJECT_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ObjectListControl),
    multi: true
};

@Component({
    selector: 'object-list',
    template: `
        <div class="content-area border">
            <div class="list-group p-2" droppable (onDrop)="onDropItem($event)">
                <a class="list-group-item list-group-item-action rounded mb-1 p-2"
                    href="javascript:void(0)"
                    *ngFor="let objectItem of model;"
                    draggable
                    [dragData]="objectItem">
                    <div class="d-flex align-items-center">
                        <fa-icon class="mr-1" [icon]="['fas', 'hashtag']"></fa-icon>
                        <div *ngFor="let item of getItems(objectItem)" class="mr-2">
                            <span>{{item.value}}</span>
                        </div>
                        <div class="hover-menu ml-auto" dropdown container="body">
                            <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                            <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right"
                                *dropdownMenu>
                                <a class="dropdown-item p-2" href="javascript:void(0)" (click)="openObjectDetailsModal(objectItem)">
                                    Edit
                                </a>
                                <a class="dropdown-item p-2" href="javascript:void(0)" (click)="removeItem(objectItem.guid)">
                                    Remove
                                </a>
                            </div>
                        </div>
                    </div>
                </a>
                <div class="list-group-item d-flex list-group-item-action rounded mb-1 p-1 bg-info"
                        dragPlaceholder></div>
            </div>
            <p class="text-center">
                <a href="javascript:void(0)" (click)="openObjectDetailsModal()">
                    Add Item
                </a>
            </p>
        </div>
    `,
    styles: [`
        .content-area .list-group{
            min-height: 80px;
        }
    `],
    // To isolate drop area of element, provide the separate instance of DndService for this element
    providers: [OBJECT_LIST_VALUE_ACCESSOR, DndService]
})
export class ObjectListControl extends CmsControl {
    @Input() itemType: new () => any;
    get model() {
        return this._model;
    }
    private _model: any[];

    constructor(private modalService: BsModalService) {
        super();
    }

    writeValue(value: any): void {
        this._model = value;
    }

    openObjectDetailsModal(item?: { [key: string]: any }) {
        const config: ModalOptions = {
            initialState: { itemType: this.itemType, itemData: item ?? {} },
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

    onDropItem(e: DropEvent) {
        if (!this._model) { this._model = []; }

        const itemIndex = e.index;
        const item = { ...e.dragData };
        const itemGuid = item.guid;
        // Sort item in content area by dnd
        // Insert new item
        item.guid = generateUUID();
        this._model.splice(itemIndex, 0, item);
        // Remove old item
        this.removeItemFromModel(itemGuid);
        this.onChange(this._model);
    }

    insertOrUpdateItem(item) {
        if (!this._model) { this._model = []; }
        const existIndex = this._model.findIndex(x => x.guid == item.guid);
        if (existIndex === -1) {
            // Insert new item
            item.guid = generateUUID();
            this._model.push(item);
        } else {
            Object.assign(this._model[existIndex], item);
        }

        this.onChange(this._model);
    }

    removeItem(itemGuid: string) {
        if (this.removeItemFromModel(itemGuid)) {
            this.onChange(this._model);
        }
    }

    getItems(control): any[] {
        const items = Object.keys(control).filter(key => key !== 'guid').map(key => ({
            key,
            value: control[key]
        }));

        return items;
    }

    private removeItemFromModel(itemGuid: string): boolean {
        const existIndex = this._model.findIndex(x => x.guid == itemGuid);
        if (existIndex === -1) { return false; }

        this._model.splice(existIndex, 1);
        return true;
    }


}
