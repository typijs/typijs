import { ControlValueAccessor } from '@angular/forms';
import { SubscriptionDestroy } from '../shared/subscription-destroy';

export abstract class CmsControl extends SubscriptionDestroy implements ControlValueAccessor {
    protected onChange: (m: any) => void;
    protected onTouched: (m: any) => void;

    /**
     * Writes a new value to the element.
     * 
     * This method is called by the forms API to write to the view when programmatic changes from model to view are requested.
     * @param obj 
     */
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