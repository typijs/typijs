import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { generateUUID } from '@angular-cms/core';

import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import { SubjectService } from '../../shared/services/subject.service';
import { SubscriptionDestroy } from '../../shared/subscription-destroy';
import { ContentAreaItem } from './ContentAreaItem';

@Component({
    selector: 'content-area',
    template: `
            <div class="content-area border">
                <div class="list-group p-2" droppable (onDrop)="onDropItem($event)">
                    <a class="list-group-item list-group-item-action rounded mb-1 p-2" href="javascript:void(0)"
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
                            <div class="hover-menu ml-auto" dropdown container="body">
                                <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                                <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right" *dropdownMenu aria-labelledby="simple-dropdown">
                                    <a class="dropdown-item p-2" href="javascript:void(0)"
                                        [ngClass]="{'disabled': item.type == 'folder_block' || item.type == 'folder_media'}" 
                                        [routerLink]="['/cms/editor/content/' + item.type, item._id]">
                                        Edit
                                    </a>
                                    <a class="dropdown-item p-2" href="javascript:void(0)" (click)="removeItem(item)">
                                        Remove
                                    </a>
                                </div>
                            </div>
                        </div>
                    </a>
                    <div class="list-group-item d-flex list-group-item-action rounded mb-1 p-1 bg-info"
                        dragPlaceholder></div>
                </div>
                <p class="text-center">You can drop content here</p>
            </div>
    `,
    styles: [`
        .list-group {
            min-height: 80px;
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
export class ContentAreaControl extends SubscriptionDestroy implements ControlValueAccessor {
    private _model: ContentAreaItem[];
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    @Input() name: string;

    get model(): ContentAreaItem[] {
        return this._model;
    }

    constructor(private subjectService: SubjectService) {
        super();
        this.subscriptions.push(this.subjectService.contentAreaDropFinished$.subscribe((item: ContentAreaItem) => {
            // Handle swap item between content area by drag and drop
            if (item.owner == this.name) {
                this.removeItem(item);
            }
        }));
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
        if (this.removeItemFromModel(item.guid)) {
            this.onChange(this._model);
        }
    }

    onDropItem(e: DropEvent) {
        if (!this._model) this._model = [];

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
            const itemGuid = item.guid;
            // Insert new item
            item.guid = generateUUID();
            this._model.splice(itemIndex, 0, item);
            if (this.removeItemFromModel(itemGuid)) {
                this.onChange(this._model);
            }
        }
        else {
            // Fire event to handle swap item between Content area
            this.subjectService.fireContentAreaDropFinished(Object.assign({}, item));
            // Insert new item
            item.guid = generateUUID();
            item.owner = this.name;
            this._model.splice(itemIndex, 0, item);
            this.onChange(this._model);
        }
    }

    private removeItemFromModel(itemGuid: string): boolean {
        const existIndex = this._model.findIndex(x => x.guid == itemGuid);
        if (existIndex == -1) return false;

        this._model.splice(existIndex, 1);
        return true;
    }
}