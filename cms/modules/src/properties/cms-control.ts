import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { ControlValueAccessor } from '@angular/forms';

export abstract class CmsControl extends SubscriptionDestroy implements ControlValueAccessor {
    protected onChange: (m: any) => void;
    protected onTouched: (m: any) => void;

    writeValue(obj: any): void {
        throw new Error("Method not implemented.");
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}