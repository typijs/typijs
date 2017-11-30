import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from '../base-element';

@Component({
    template: `
    <div class="form-group">
        <input class="form-control" type="text" name="name" [placeholder]="title" required>
    </div>
  `
})
export class StringComponent extends BaseComponent {
}