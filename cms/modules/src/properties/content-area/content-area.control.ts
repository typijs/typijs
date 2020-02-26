import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Content } from '@angular-cms/core';

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export interface ContentAreaItem {
    //mongoose Object id
    _id?: string;
    //guid id in this content area
    guid?: string;
    //belong to which content area
    owner?: string;
    name?: string;
    contentType?: string;
    //type of content area item
    type?: string;
}

@Component({
    selector: 'content-area',
    template: `
            <ul class="list-group" droppable (onDrop)="onDropItem($event)">
                <li class="list-group-item d-flex list-group-item-action justify-content-between align-items-center" 
                    *ngFor="let item of model;" 
                    draggable 
                    [dragData]="item">
                    <div>
                        <i class="fa fa-comment fa-fw"></i> {{item.name}}
                    </div>
                </li>
                <li class="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
                    dndPlaceholder>
                    <div>
                        <i class="fa fa-comment fa-fw"></i> Drop here
                    </div>
                </li>
            </ul>
`,
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

    onDropItem(e: any) {
        if (!this._model) this._model = [];
        //TODO: emit unnecessary field when drop 
        const itemIndex = e.index;
        const { _id, name, contentType, isPublished }: Partial<Content> = e.dragData;
        const item: Partial<ContentAreaItem> = {
            _id: _id,
            name: name,
            contentType: contentType,
        };

        if (item.owner == this.name) {
            const oldGuid = item.guid;
            item.guid = generateUUID();

            this._model.splice(itemIndex, 0, item);
            const existIndex = this._model.findIndex(x => x.guid == oldGuid);
            if (existIndex != -1) {
                this._model.splice(existIndex, 1);
            }
        } else {
            item.guid = generateUUID();
            item.owner = this.name;
            this._model.splice(itemIndex, 0, item);
        }

        this.onChange(this._model);
    }
}