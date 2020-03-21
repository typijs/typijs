import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CmsControl } from '../cms-control';

@Component({
    selector: 'content-reference',
    template: `
            <div class="tab-content" droppable (onDrop)="onDropItem($event)">
                <div class="tab-pane active">
                    <div *ngIf="model">
                        <i class="fa fa-comment fa-fw"></i> {{model.name}}
                        <span class="pull-right text-muted small"><em>{{model.value}}</em>
                        </span>
                    </div>
                </div>
                <div dragPlaceholder></div>
            </div>
`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ContentReferenceControl),
            multi: true
        }
    ]
})
export class ContentReferenceControl extends CmsControl {

    @Input() name: string;

    get model() {
        return this._model;
    }
    private _model: any;

    writeValue(value: any): void {
        this._model = value;
        if (this._model) {
            this._model.owner = this.name;
        }
    }

    onDropItem(e: any) {
        this._model = e.dragData;
        this._model.owner = this.name;

        this.onChange(this._model);
    }
}