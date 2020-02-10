import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
                <div dndPlaceholder></div>
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
export class ContentReferenceControl implements ControlValueAccessor {
    private _model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    @Input() name: string;

    get model() {
        return this._model;
    }

    writeValue(value: any): void {
        this._model = value;
        if (this._model) {
            this._model.owner = this.name;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onDropItem(e: any) {
        this._model = e.dragData;
        this._model.owner = this.name;
        
        this.onChange(this._model);
    }
}