import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'hero-banner',
    templateUrl: 'hero-banner.component.html'
})
export class HeroBannerComponent implements OnInit {

    @Input() image: string;
    @Input() text: string;
    constructor() { }

    ngOnInit() { }
}
