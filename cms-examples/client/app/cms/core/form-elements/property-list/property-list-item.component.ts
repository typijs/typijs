import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseElement } from './../base.element';

@Component({
    selector: 'property-items',
    template: `
    <div [formGroup]="formGroup">
        <div class="list-group" [formArrayName]="propertyName">
            <div *ngFor="let control of formGroup['controls'][propertyName]['controls']; let i=index" [formGroupName]="i">
                <a href="javascript:void(0)" class="list-group-item">
                    <div *ngFor="let item of getItems(control)">
                        <input type="hidden" [formControlName]="item.key"/>
                        <i class="fa fa-comment fa-fw"></i> {{item.key}}
                        <span class="pull-right text-muted small"><em>{{item.value}}</em>
                        </span>
                    </div>
                </a>
            </div>
        </div>
    </div>
  `
})
export class PropertyListItemComponent extends BaseElement {

    @Input() formGroup: any;
    @Input() propertyName: string;

    getItems(control):  Array<any> {
        let items=[]
        Object.keys(control.value).forEach(key=>{
            items.push({
                key: key,
                value: control.value[key]
            })
        })
        return items
    }
}