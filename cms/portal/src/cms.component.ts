import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    template: `<router-outlet></router-outlet>`,
    styleUrls: ['./cms.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CmsComponent {
}