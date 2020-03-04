import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ContentAreaItem } from './ContentAreaItem';

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

@Component({
    selector: 'content-area',
    template: `
            <ul class="content-area list-group border p-2" droppable (onDrop)="onDropItem($event)">
                <li class="list-group-item list-group-item-action rounded mb-1 p-2" 
                    *ngFor="let item of model;" 
                    draggable 
                    [dragData]="item">
                    <div class="d-flex align-items-center">
                        <ng-container [ngSwitch]="item.type">
                            <fa-icon *ngSwitchCase="'page'" class="mr-1" [icon]="['fas', 'file']"></fa-icon>
                            <fa-icon *ngSwitchCase="'media'" class="mr-1" [icon]="['fas', 'image']"></fa-icon>
                            <fa-icon *ngSwitchCase="'folder_block'" class="mr-1" [icon]="['fas', 'folder']"></fa-icon>
                            <fa-icon *ngSwitchCase="'folder_media'" class="mr-1" [icon]="['fas', 'folder']"></fa-icon>
                            <fa-icon *ngSwitchDefault class="mr-1" [icon]="['fas', 'cube']"></fa-icon>
                        </ng-container>
                        <div class="w-100 mr-2 text-truncate">{{item.name}}</div>
                        <div class="item-menu ml-auto" dropdown container="body">
                            <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                            <div class="node-menu-dropdown dropdown-menu dropdown-menu-right" *dropdownMenu aria-labelledby="simple-dropdown">
                                <a class="dropdown-item p-2" href="javascript:void(0)">
                                    Edit
                                </a>
                                <a class="dropdown-item p-2" href="javascript:void(0)" (click)="removeItem(item)">
                                    Remove
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="list-group-item d-flex list-group-item-action rounded mb-1 p-1 bg-info"
                    dndPlaceholder></li>
            </ul>
    `,
    styles: [`
        .content-area {
            min-height: 100px;
        }

        .item-menu {
            display: none;
        }

        .list-group-item-action:focus,
        .list-group-item-action:hover {
            z-index: 0;
            }

        .list-group-item-action:focus .item-menu, 
        .list-group-item-action:hover .item-menu {
            display: block;
        }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ContentAreaControl),
            multi: true
        }
    ]
})
export class ContentAreaControl implements ControlValueAccessor {
    private _model: ContentAreaItem[];
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    @Input() name: string;

    get model(): ContentAreaItem[] {
        return this._model;
    }
    //Writes a new value to the element.
    //This method is called by the forms API to write to the view when programmatic changes from model to view are requested.
    writeValue(value: any): void {
        this._model = value;
        if (this._model) {
            this._model.forEach(x => {
                x.owner = this.name;
                x.guid = generateUUID();
            });
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    removeItem(item: Partial<ContentAreaItem>) {
        const existIndex = this._model.findIndex(x => x.guid == item.guid);
        if (existIndex != -1) {
            this._model.splice(existIndex, 1);
        }
        this.onChange(this._model);
    }

    onDropItem(e: any) {
        if (!this._model) this._model = [];
        //TODO: emit unnecessary field when drop 
        const itemIndex = e.index;
        const { _id, id, name, owner, guid, extendProperties, type, contentType, isPublished } = e.dragData;
        const item: ContentAreaItem = {
            _id: _id ? _id : id,
            name: name,
            owner: owner,
            guid: guid,
            type: extendProperties ? extendProperties.type : type,
            contentType: extendProperties ? extendProperties.contentType : contentType,
            isPublished: extendProperties ? extendProperties.isPublished : isPublished
        };

        if (item.owner == this.name) {
            // Sort item in content area by dnd
            const oldGuid = item.guid;
            item.guid = generateUUID();

            this._model.splice(itemIndex, 0, item);
            const existIndex = this._model.findIndex(x => x.guid == oldGuid);
            if (existIndex != -1) {
                this._model.splice(existIndex, 1);
            }
        }
        else {
            // Insert new item
            item.guid = generateUUID();
            item.owner = this.name;
            this._model.splice(itemIndex, 0, item);
        }

        this.onChange(this._model);
    }
}