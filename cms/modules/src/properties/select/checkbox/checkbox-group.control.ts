import { SelectItem } from '@angular-cms/core';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CmsControl } from '../../cms-control';

const CHECKBOX_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxGroupControl),
    multi: true
};

@Component({
    selector: 'checkbox-group',
    template: `
        <div class="checkbox" *ngFor="let selectItem of selectItems;">
            <label>
                <input type="checkbox" [checked]="selectItem.isSelected" (change)="toggleCheck(selectItem)">{{selectItem.text}}
            </label>
        </div>
`,
    providers: [CHECKBOX_GROUP_VALUE_ACCESSOR]
})
export class CheckboxGroupControl extends CmsControl {

    @Input() selectItems: SelectItem[];

    model: any[];

    writeValue(value: any): void {
        if (this.selectItems && value instanceof Array) {
            this.selectItems.forEach(item => {
                if (value.indexOf(item.value) > -1) {
                    item.isSelected = true;
                } else {
                    item.isSelected = false;
                }
            });
        }
        this.model = value;
    }

    toggleCheck(selectItem: SelectItem) {
        selectItem.isSelected = !selectItem.isSelected
        const { value } = selectItem;
        if (this.contains(value)) {
            this.remove(value);
        } else {
            this.add(value);
        }
    }

    private contains(value: any): boolean {
        if (this.model instanceof Array) {
            return this.model.indexOf(value) > -1;
        } else if (!!this.model) {
            return this.model === value;
        }

        return false;
    }

    private add(value: any) {
        this.model = this.selectItems.filter(item => item.isSelected).map(item => item.value);
        this.onChange(this.model);
    }

    private remove(value: any) {
        const index = this.model.indexOf(value);
        if (!this.model || index < 0) {
            return;
        }

        this.model.splice(index, 1);
        this.onChange(this.model);
    }
}
