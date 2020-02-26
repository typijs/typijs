import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'property-group',
    template: `
            <ul class="list-group">
                <li *ngFor="let control of model;" class="list-group-item d-flex list-group-item-action justify-content-between align-items-center">
                    <div *ngFor="let item of getItems(control)">
                        <i class="fa fa-comment fa-fw"></i> {{item.key}}
                        <span class="pull-right text-muted small"><em>{{item.value}}</em>
                        </span>
                    </div>
                </li>
            </ul>
`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PropertyListControl),
            multi: true
        }
    ]
})
export class PropertyListControl implements ControlValueAccessor {
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

    addItem(item) {
        if (!this._model) this._model = [];
        this._model.push(item);
        this.onChange(this._model);
    }

    getItems(control): Array<any> {
        let items = []
        Object.keys(control).forEach(key => {
            items.push({
                key: key,
                value: control[key]
            })
        })
        return items
    }
}