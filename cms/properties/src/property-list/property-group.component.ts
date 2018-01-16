import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'property-group',
    template: `
            <div class="list-group">
                <div *ngFor="let control of model;">
                    <a href="javascript:void(0)" class="list-group-item">
                        <div *ngFor="let item of getItems(control)">
                            <i class="fa fa-comment fa-fw"></i> {{item.key}}
                            <span class="pull-right text-muted small"><em>{{item.value}}</em>
                            </span>
                        </div>
                    </a>
                </div>
            </div>
`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PropertyGroupComponent),
            multi: true
        }
    ]
})
export class PropertyGroupComponent implements ControlValueAccessor {
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

    set(value: any) {
        this._model = value;
        this.onChange(this._model);
    }
    
    addItem(item) {
        if(!this._model) this._model = [];
        this._model.push(item);
        this.onChange(this._model);
    }

    getItems(control):  Array<any> {
        let items=[]
        Object.keys(control).forEach(key=>{
            items.push({
                key: key,
                value: control[key]
            })
        })
        return items
    }
}