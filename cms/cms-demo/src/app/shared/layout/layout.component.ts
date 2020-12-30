import { ContentLoader, PageData, SiteDefinition } from '@angular-cms/core';
import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, OnInit, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { HomePage } from '../../pages/home/home.pagetype';

@Component({
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit, AfterViewInit {
    startPage$: Observable<HomePage>;
    menuItems$: Observable<PageData[]>;

    constructor(
        private siteDefinition: SiteDefinition,
        private contentLoader: ContentLoader,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document) { }

    ngOnInit() {
        const siteDefinition$ = this.siteDefinition.current().pipe(
            publishReplay(1),// this tells Rx to cache the latest emitted
            refCount() // and this tells Rx to keep the Observable alive as long as there are any Subscribers
        )
        this.startPage$ = siteDefinition$.pipe(
            switchMap(([startPageId, language]) => this.contentLoader.get<HomePage>(startPageId, language))
        );
        this.menuItems$ = siteDefinition$.pipe(
            switchMap(([startPageId, language]) => this.contentLoader.getChildren<PageData>(startPageId, { language }))
        );
    }

    ngAfterViewInit(): void {
        const script = this.renderer.createElement('script');
        script.type = 'text/javascript';
        script.src = 'assets/js/layout.js';
        this.renderer.appendChild(this.document.body, script);
    }
}
