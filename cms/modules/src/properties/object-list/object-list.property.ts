import { Component, Input } from '@angular/core';
import { ClassOf, CmsProperty } from '@typijs/core';
@Component({
    selector: '[objectListProperty]',
    template: `
    <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
        <div class="col-5">
            <object-list [formControlName]="propertyName" [itemType]="itemType"></object-list>
        </div>
    </div>
  `
})
export class ObjectListProperty extends CmsProperty {
    @Input() itemType: ClassOf<any>;
}
