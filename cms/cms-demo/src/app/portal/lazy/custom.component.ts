import { Component } from '@angular/core';

@Component({
    template: `
    <p  [routerLink]="['test-custom']">Custom module</p>
    <p  [routerLink]="['test-lazy']">Lazy module</p>
    `
})
export class CustomEntryComponent {
}

@Component({
    template: `
    <div class="row">
        <div class="col-12">
            This is custom component
        </div>
    </div>
  `
})
export class CustomComponent {
}





