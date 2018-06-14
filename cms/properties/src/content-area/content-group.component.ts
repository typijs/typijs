import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'content-group',
    template: `
            <ul class="list-group" droppable (onDrop) = "onDropItem($event)">
                <li *ngFor="let item of model;" class="list-group-item d-flex list-group-item-action justify-content-between align-items-center">
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
            useExisting: forwardRef(() => ContentGroupComponent),
            multi: true
        }
    ]
})
export class ContentGroupComponent implements ControlValueAccessor {
    private _model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    get model() {
        return this._model;
    }

    writeValue(value: any): void {
        this._model = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onDropItem(e: any) {
        if (!this._model) this._model = [];
        this._model.splice(e.index, 0, e.dragData);
        this.onChange(this._model);
    }
}