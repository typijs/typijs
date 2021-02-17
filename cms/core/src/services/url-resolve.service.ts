import { Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { concatMap, debounceTime, distinct, first, map, scan, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { isUrlAbsolute } from '../helpers/common';
import { UrlItem } from '../types/url-item';
import { Page } from './content/models/page.model';
import { PageService } from './content/page.service';

@Injectable({
    providedIn: 'root'
})
export class UrlResolveService implements OnDestroy {

    /**
     * The page urls subject to store all the urls which are fetched
     */
    private pageUrlsSubject: ReplaySubject<Page[]> = new ReplaySubject();
    private pageUrls$: Observable<Page[]> = this.pageUrlsSubject.asObservable();

    private pageIdSubject: Subject<string> = new Subject();
    private destroy$: Subject<any> = new Subject();
    private fetchedPageIds: string[] = [];

    constructor(
        private pageService: PageService,
        private sanitizer: DomSanitizer,
        private configService: ConfigService) {
        this.pageIdSubject.pipe(
            distinct(),
            scan((allPageIds: string[], currentPageId: string) =>
                [...allPageIds, currentPageId], []),
            debounceTime(1000),
            map(pageIds => pageIds.filter(p => !this.fetchedPageIds.includes(p))),
            concatMap((pageIds) => this.pageService.getPageUrls(pageIds)),
            takeUntil(this.destroy$)
        ).subscribe((pages: Page[]) => {
            this.fetchedPageIds = this.fetchedPageIds.concat(pages.map(x => x._id));
            this.pageUrlsSubject.next(pages);
        });
    }

    /**
     * Gets page url from the page id
     * @param pageId The Page Id
     * @returns The publish link url based on host and language
     */
    getPageUrl(pageId: string): Observable<string> {
        if (!pageId) { return of(''); }

        this.pageIdSubject.next(pageId);
        return this.pageUrls$.pipe(
            first((pages) => pages.some(x => x._id === pageId)),
            map((pages) => pages.find(x => x._id === pageId)?.linkUrl)
        );
    }

    /**
     * Get the `href` from the `UrlItem` object
     * @param urlItem The url item instance
     */
    getHrefFromUrlItem(urlItem: UrlItem): SafeUrl {
        switch (urlItem.urlType) {
            case 'media':
                const imgSrc = isUrlAbsolute(urlItem.media?.src) ? urlItem.media?.src : `${this.configService.baseApiUrl}${urlItem.media?.src}`;
                return this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            case 'email':
                return this.sanitizer.bypassSecurityTrustUrl(`mailto:${urlItem.email}`);
            case 'external':
                return this.sanitizer.bypassSecurityTrustUrl(urlItem.external);
            default:
                return '';
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
