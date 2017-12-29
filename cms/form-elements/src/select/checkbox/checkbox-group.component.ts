import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from '../select-item';

@Component({
    selector: 'checkbox-group',
    template: `
    <div class="checkbox" *ngFor="let selectItem of selectItems;">
        <label>
            <input type="checkbox" [checked]="selectItem.selected" (change)="toggleCheck(selectItem)">{{selectItem.text}}
        </label>
    </div>
`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxGroupComponent),
            multi: true
        }
    ]
})
export class CheckboxGroupComponent implements ControlValueAccessor {
    private _model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    @Input() selectItems: Array<any>;

    get model() {
        return this._model;
    }

    writeValue(value: any): void {
        if(this.selectItems && value instanceof Array) {
            this.selectItems.forEach(item=>{
                if(value.indexOf(item.value) > -1) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            })
        }
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

    addOrRemove(value: any) {
        if (this.contains(value)) {
            this.remove(value);
        } else {
            this._model = this.selectItems.filter(item=>item.selected).map(item=> item.value);
            this.onChange(this._model);
        }
    }

    contains(value: any): boolean {
        if (this._model instanceof Array) {
            return this._model.indexOf(value) > -1;
        } else if (!!this._model) {
            return this._model === value;
        }

        return false;
    }

    private remove(value: any) {
        const index = this._model.indexOf(value);
        if (!this._model || index < 0) {
            return;
        }

        this._model.splice(index, 1);
        this.onChange(this._model);
    }

    toggleCheck(selectItem) {
        selectItem.selected = !selectItem.selected;
        this.addOrRemove(selectItem.value);
    }
}