import { CmsComponent } from '@angular-cms/core';
import { Component } from '@angular/core';
import { NewsletterBlock } from './newsletter.blocktype';

@Component({
    selector: 'section[newsletter-block]',
    host: { 'class': 'ftco-section ftco-no-pt ftco-no-pb py-5 bg-light' },
    template: `
    <div class="container py-4">
        <div class="row d-flex justify-content-center py-5">
            <div class="col-md-6">
                <h2 style="font-size: 22px;" class="mb-0" [cmsText]="currentContent.heading"></h2>
                <span [cmsText]="currentContent.subheading"></span>
            </div>
            <div class="col-md-6 d-flex align-items-center">
                <form action="#" class="subscribe-form">
                    <div class="form-group d-flex">
                        <input type="text" class="form-control" [placeholder]="currentContent.placeholder">
                        <input type="submit" [value]="currentContent.buttonText" class="submit px-3">
                    </div>
                </form>
            </div>
        </div>
    </div>
`
})
export class NewsletterComponent extends CmsComponent<NewsletterBlock> {
    constructor() {
        super();
    }
}
