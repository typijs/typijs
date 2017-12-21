import { Component, Input, Host } from '@angular/core';
import { CheckboxGroupComponent } from './checkbox-group.component';

@Component({
    selector: 'checkbox',
    template: `
        <div class="checkbox">
            <label>
                <input type="checkbox" [checked]="isChecked()" (change)="toggleCheck()"><ng-content></ng-content>
            </label>
        </div>
    `
})
export class CheckboxComponent {
    @Input() value: any;

    constructor( @Host() private checkboxGroup: CheckboxGroupComponent) {
    }

    toggleCheck() {
        this.checkboxGroup.addOrRemove(this.value);
    }

    isChecked() {
        return this.checkboxGroup.contains(this.value);
    }
}