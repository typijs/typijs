import { Component, ElementRef, HostBinding, HostListener, Injectable, Injector, OnInit, Renderer2 } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UrlResolveService } from '../../services/url-resolve.service';
import { UIHint } from '../../types/ui-hint';
import { LinkTarget, UrlItem } from '../../types/url-item';
import { CmsPropertyRender } from '../property-render';
import { CmsPropertyRenderFactory } from '../property-render.factory';

@Component({
    selector: 'a',
    template: `{{value.text}}`
})
export class UrlPropertyRender extends CmsPropertyRender<UrlItem> implements OnInit {
    @HostBinding('attr.href') href: SafeUrl;
    @HostBinding('attr.target') target: LinkTarget;
    url: string;
    constructor(
        private router: Router,
        private urlResolve: UrlResolveService,
        private linkRef: ElementRef,
        private renderer: Renderer2
    ) { super(); }

    ngOnInit() {
        if (this.value) {
            const { target, urlType, page } = this.value;
            if (target) { this.target = target; }

            if (urlType === 'page' && page) {
                this.urlResolve.getPageUrl(page.id).subscribe((pageUrl) => {
                    if (pageUrl) {
                        this.url = pageUrl;
                        setTimeout(() => this.renderer.setProperty(this.linkRef.nativeElement, 'href', pageUrl), 0);
                    }
                });
            } else {
                this.href = this.urlResolve.getHrefFromUrlItem(this.value);
            }
        }
    }

    @HostListener('click')
    onClick(): boolean {
        if (this.value?.urlType === 'page' && this.url) {
            this.router.navigateByUrl(this.url);
            return false;
        }
        return true;
    }

}

@Injectable()
export class UrlRenderFactory extends CmsPropertyRenderFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.Url, UrlPropertyRender);
    }
}

