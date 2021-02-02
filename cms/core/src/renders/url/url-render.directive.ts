import { Directive, ElementRef, HostBinding, HostListener, Injector, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';
import { isUrlAbsolute } from '../../helpers/common';
import { LinkService } from '../../services/link.service';
import { LinkTarget, UrlItem } from '../../types/url-item';
import { PropertyDirectiveBase } from '../property-directive.base';

@Directive({
    selector: 'a[cmsUrl]'
})
export class UrlRenderDirective extends PropertyDirectiveBase implements OnInit {
    @HostBinding('attr.href') href: SafeUrl;
    @HostBinding('attr.target') target: LinkTarget;

    @Input('cmsUrl') urlItem: UrlItem;
    url: string;

    constructor(
        injector: Injector,
        private router: Router,
        private configService: ConfigService,
        private linkService: LinkService,
        private linkRef: ElementRef,
        private sanitizer: DomSanitizer) {
        super(injector, linkRef);
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.urlItem) {
            const { target, urlType, page } = this.urlItem;
            if (target) { this.target = target; }

            if (urlType === 'page' && page) {
                this.linkService.pushToFetchPageUrl(page.id).pipe(
                    first((pages) => pages.some(x => x._id === page.id))
                ).subscribe((pages) => {
                    const matchPage = pages.find(x => x._id === page.id);
                    if (matchPage) {
                        this.url = matchPage.linkUrl;
                        setTimeout(() => this.renderer.setProperty(this.linkRef.nativeElement, 'href', matchPage.linkUrl), 0);
                    }
                });
            } else {
                this.href = this.getHrefFromUrlItem(this.urlItem);
            }
        }
    }

    @HostListener('click')
    onClick(): boolean {
        if (this.urlItem?.urlType === 'page' && this.url) {
            this.router.navigateByUrl(this.url);
            return false;
        }
        return true;
    }

    private getHrefFromUrlItem(urlItem: UrlItem): SafeUrl {
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
}
