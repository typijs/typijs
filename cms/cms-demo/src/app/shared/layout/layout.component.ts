import { ContentLoader, PageData, SiteDefinition } from '@typijs/core';
import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, OnInit, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount, switchMap } from 'rxjs/operators';

import { HomePage } from '../../pages/home/home.pagetype';
import { MenuItem, MenuService } from '../menu.service';

@Component({
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, AfterViewInit {
    startPage$: Observable<HomePage>;
    menuItems$: Observable<MenuItem[]>;

    constructor(
        private siteDefinition: SiteDefinition,
        private contentLoader: ContentLoader,
        private menuService: MenuService,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document) { }

    ngOnInit() {
        this.startPage$ = this.siteDefinition.getStartPage<HomePage>();
        this.menuItems$ = this.startPage$.pipe(
            switchMap((startPage: HomePage) => this.menuService.getPageVisibleInMenu(startPage))
        );
    }

    ngAfterViewInit(): void {
        const script = this.renderer.createElement('script');
        script.type = 'text/javascript';
        script.src = 'assets/js/layout.js';
        this.renderer.appendChild(this.document.body, script);
    }
}
