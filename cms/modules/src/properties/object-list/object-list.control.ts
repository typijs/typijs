import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CmsControl } from '../cms-control';

const OBJECT_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ObjectListControl),
    multi: true
};

@Component({
    selector: 'object-list',
    template: `
            <div class="object-list">
                <div class="object-header d-flex align-items-center" *ngIf="model && model.length > 0">
                    <fa-icon class="mr-1" [icon]="['fas', 'list']"></fa-icon>
                    <div *ngFor="let item of getItems(model[0])">
                        {{item.key}}
                    </div>
                </div>
                <div class="list-group" droppable>
                    <a class="list-group-item list-group-item-action" href="javascript:void(0)"
                        *ngFor="let objectItem of model;"
                        draggable
                        [dragData]="objectItem">
                        <div class="d-flex align-items-center">
                            <fa-icon class="mr-1" [icon]="['fas', 'hashtag']"></fa-icon>
                            <div *ngFor="let item of getItems(objectItem)">
                                <span>{{item.value}}</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `,
    providers: [OBJECT_LIST_VALUE_ACCESSOR]
})
export class ObjectListControl extends CmsControl {
    get model() {
        return this._model;
    }
    private _model: any[];

    writeValue(value: any): void {
        this._model = value;
    }

    addItem(item) {
        if (!this._model) { this._model = []; }
        this._model.push(item);
        this.onChange(this._model);
    }

    getItems(control): any[] {
        const items = [];
        Object.keys(control).forEach(key => {
            items.push({
                key,
                value: control[key]
            });
        });
        return items;
    }
}
