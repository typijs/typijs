import { Directive, ElementRef, HostBinding, HostListener, Injector, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UrlResolveService } from '../../services/url-resolve.service';
import { LinkTarget, UrlItem } from '../../types/url-item';
import { PropertyDirectiveBase } from '../property-directive.base';

@Directive({
    selector: 'a[cmsUrl]'
})
export class UrlRenderDirective extends PropertyDirectiveBase implements OnInit {
    @HostBinding('attr.href') href: SafeUrl;
    @HostBinding('attr.target') target: LinkTarget;
    @HostBinding('attr.title') title: string;

    @Input('cmsUrl') urlItem: UrlItem;
    url: string;

    constructor(
        injector: Injector,
        private router: Router,
        private urlResolve: UrlResolveService,
        private linkRef: ElementRef) {
        super(injector, linkRef);
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.urlItem) {
            const { target, urlType, page } = this.urlItem;
            if (target) { this.target = target; }

            if (urlType === 'page' && page) {
                this.urlResolve.getPageUrl(page.id).subscribe((pageUrl) => {
                    if (pageUrl) {
                        this.url = pageUrl;
                        setTimeout(() => this.renderer.setProperty(this.linkRef.nativeElement, 'href', pageUrl), 0);
                    }
                });
            } else {
                this.href = this.urlResolve.getHrefFromUrlItem(this.urlItem);
                this.title = this.urlItem.title;
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
}
