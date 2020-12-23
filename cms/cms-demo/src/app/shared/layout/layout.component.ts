import { ContentLoader, PageData, PageService } from '@angular-cms/core';
import { Component, ViewEncapsulation, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { HomePage } from '../../pages/home/home.pagetype';

@Component({
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, AfterViewInit {
    startPage$: Observable<HomePage>;
    menuItems$: Observable<PageData[]>;

    constructor(private contentService: PageService, private contentLoader: ContentLoader, private renderer: Renderer2) { }

    ngOnInit() {
        this.startPage$ = this.contentService.getStartPage().pipe(
            map(page => new HomePage(page)),
            tap(page => {
                if (page) {
                    this.menuItems$ = this.contentLoader.getChildren<PageData>(page.contentLink);
                }
            })
        );
    }

    ngAfterViewInit(): void {
        const script = this.renderer.createElement('script');
        script.type = 'text/javascript';
        script.src = 'assets/js/layout.js';
        this.renderer.appendChild(document.body, script);
    }
}
