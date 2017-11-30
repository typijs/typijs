import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    template: `
    <div class="form-group">
        <input class="form-control" type="text" name="name" placeholder="Name" required>
    </div>
  `
})
export class StringComponent {

}