import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    template: `<router-outlet></router-outlet>`,
    styleUrls: ['./scss/style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CmsComponent {
}