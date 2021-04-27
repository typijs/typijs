import { Component, forwardRef, Inject, Input, Provider } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ADMIN_ROUTE, generateUUID } from '@typijs/core';
import { takeUntil } from 'rxjs/operators';

import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import { SubjectService } from '../../shared/services/subject.service';
import { ContentAreaItem } from './content-area.model';
import { CmsControl } from '../cms-control';

const CONTENT_AREA_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContentAreaControl),
    multi: true
};

@Component({
    selector: 'content-area',
    template: `
            <div class="content-area border">
                <div class="list-group p-2" droppable [dropScope]="isDropAllowed" (onDrop)="onDropItem($event)">
                    <a class="list-group-item list-group-item-action rounded mb-1 p-2"
                        href="javascript:void(0)"
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
                                <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right"
                                    *dropdownMenu
                                    aria-labelledby="simple-dropdown">
                                    <a class="dropdown-item p-2" href="javascript:void(0)"
                                        [ngClass]="{'disabled': item.type == 'folder_block' || item.type == 'folder_media'}"
                                        [routerLink]="[adminPath + '/editor/content/' + item.type, item._id]">
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
        .content-area .list-group {
            min-height: 80px;
        }
    `],
    providers: [CONTENT_AREA_VALUE_ACCESSOR]
})
export class ContentAreaControl extends CmsControl {
    @Input() propertyName: string;
    @Input() allowedTypes: string[];

    private _model: ContentAreaItem[];
    get model(): ContentAreaItem[] {
        return this._model;
    }

    constructor(@Inject(ADMIN_ROUTE) public adminPath: string, private subjectService: SubjectService) {
        super();
        this.subjectService.contentDropFinished$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((item: ContentAreaItem) => {
                // Handle swap item between content area by drag and drop
                if (item.owner === this.propertyName) {
                    this.removeItem(item);
                }
            });
    }

    writeValue(value: any): void {
        this._model = value;
    }

    isDropAllowed = (dragData) => {
        const { contentType, type } = dragData;
        if (!this.allowedTypes) { return contentType && type; }

        return this.allowedTypes.indexOf(contentType) > -1;
    }

    removeItem(item: Partial<ContentAreaItem>) {
        if (this.removeItemFromModel(item.guid)) {
            this.onChange(this._model);
        }
    }

    onDropItem(e: DropEvent) {
        if (!this._model) { this._model = []; }

        const itemIndex = e.index;
        const { _id, id, name, owner, guid, type, contentType, isPublished } = e.dragData;
        const item: ContentAreaItem = {
            _id: _id ? _id : id,
            name: name,
            owner: owner,
            guid: guid,
            type: type,
            contentType: contentType,
            isPublished: isPublished
        };

        if (item.owner === this.propertyName) {
            // Sort item in content area by dnd
            const itemGuid = item.guid;
            // Insert new item
            this.insertItemToModel(itemIndex, item);
            this.removeItemFromModel(itemGuid);
            this.onChange(this._model);
        } else {
            // Fire event to handle swap item between Content area
            if (item.owner && item.guid) { this.subjectService.fireContentDropFinished(item); }
            // Insert new item
            item.owner = this.propertyName;
            this.insertItemToModel(itemIndex, item);
            this.onChange(this._model);
        }
    }

    private insertItemToModel(insertIndex: number, item: ContentAreaItem) {
        item.guid = generateUUID();
        this._model.splice(insertIndex, 0, item);
    }

    private removeItemFromModel(itemGuid: string): boolean {
        const existIndex = this._model.findIndex(x => x.guid == itemGuid);
        if (existIndex === -1) { return false; }

        this._model.splice(existIndex, 1);
        return true;
    }
}
