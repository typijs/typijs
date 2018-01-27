import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'content-group',
    template: `
            <div class="list-group">
                <div *ngFor="let item of model;">
                    <a href="javascript:void(0)" class="list-group-item">
                        <div>
                            <i class="fa fa-comment fa-fw"></i> {{item.name}}
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

    set(value: any) {
        this._model = value;
        this.onChange(this._model);
    }
    
    addItem(item) {
        if(!this._model) this._model = [];
        this._model.push(item);
        this.onChange(this._model);
    }
}