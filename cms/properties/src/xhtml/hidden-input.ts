import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'hidden-input',
    template: `
    <input type="hidden" [value]="value"/> 
`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HiddenInputControl),
            multi: true
        }
    ]
})
export class HiddenInputControl implements ControlValueAccessor {
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    //userd to store internal value
    value: string;

    //Implement of the ControlValueAccessor interface
    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    //Helper method for setting the inital value (call when bind data in first time)
    set(value: any) {
        this.value = value;
        this.onChange(this.value);
    }
}