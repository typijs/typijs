import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

@Component({
    selector: 'content-group',
    template: `
            <ul class="list-group" droppable (onDrop)="onDropItem($event)">
                <li *ngFor="let item of model;" draggable [dragData]="item" class="list-group-item d-flex list-group-item-action justify-content-between align-items-center">
                    <div>
                        <i class="fa fa-comment fa-fw"></i> {{item.name}}
                        <span class="pull-right text-muted small"><em>{{item.value}}</em>
                        </span>
                    </div>
                </li>
                <li dndPlaceholder>
                    This is dnd placeholder
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
    private _model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    @Input() name: string;

    get model() {
        return this._model;
    }

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
        let item = e.dragData;

        if (item.owner == this.name) {
            let oldGuid = item.guid;
            item.guid = generateUUID();
            this._model.splice(e.index, 0, item);
            let existIndex = this._model.findIndex(x => x.guid == oldGuid);
            if (existIndex != -1) {
                this._model.splice(existIndex, 1);
            }
        } else {
            item.guid = generateUUID();
            item.owner = this.name;
            this._model.splice(e.index, 0, item);
        }

        this.onChange(this._model);
    }
}