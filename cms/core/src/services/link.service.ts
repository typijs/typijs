import { Injectable, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { concatMap, debounceTime, distinct, filter, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { isUrlAbsolute } from '../helpers/common';
import { UrlItem } from '../types/url-item';
import { Page } from './content/models/page.model';
import { PageService } from './content/page.service';

@Injectable({
    providedIn: 'root'
})
export class LinkService implements OnDestroy {

    private pageUrlsSubject: ReplaySubject<Page[]> = new ReplaySubject();
    private pageUrls$: Observable<Page[]> = this.pageUrlsSubject.asObservable();

    private pageIdSubject: Subject<string> = new Subject();
    private destroy$: Subject<any> = new Subject();
    private pageIds: string[] = [];
    private fetchedPageIds: string[] = [];

    constructor(
        private pageService: PageService,
        private sanitizer: DomSanitizer,
        private configService: ConfigService) {
        this.pageIdSubject.pipe(
            distinct(),
            filter(pageId => !this.fetchedPageIds.includes(pageId)),
            debounceTime(1000),
            concatMap(() => this.pageService.getPageUrls(this.pageIds.filter(pageId => !this.fetchedPageIds.includes(pageId)))),
            takeUntil(this.destroy$)
        ).subscribe((pages: Page[]) => {
            this.fetchedPageIds = this.fetchedPageIds.concat(pages.map(x => x._id));
            this.pageUrlsSubject.next(pages);
        });
    }

    /**
     * Push the page Id into array to prepare fetch the page urls
     */
    pushToFetchPageUrl(pageId: string): Observable<Page[]> {
        if (!this.pageIds.includes(pageId)) {
            this.pageIds.push(pageId);
            this.pageIdSubject.next(pageId);
        }
        return this.pageUrls$;
    }

    getHrefFromUrlItem(urlItem: UrlItem): SafeUrl {
        switch (urlItem.urlType) {
            case 'media':
                const imgSrc = isUrlAbsolute(urlItem.media?.src) ? urlItem.media?.src : `${this.configService.baseApiUrl}${urlItem.media?.src}`;
                return this.sanitizer.bypassSecurityTrustUrl(imgSrc);
            case 'email':
                return `mailto:${urlItem.email}`;
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
