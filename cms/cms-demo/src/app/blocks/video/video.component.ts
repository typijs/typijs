import { CmsComponent } from '@angular-cms/core';
import { Component } from '@angular/core';
import { VideoBlock } from './video.blocktype';

@Component({
    selector: 'section[video-block]',
    host: { 'class': 'ftco-section ftco-no-pb ftco-no-pt bg-light' },
    template: `
    <div class="container">
        <div class="row">
            <div class="col-md-5 p-md-5 img img-2 d-flex justify-content-center align-items-center" style="background-image: url(images/about.jpg);">
                <a [href]="currentContent.video" class="icon popup-vimeo d-flex justify-content-center align-items-center">
                    <span class="icon-play"></span>
                </a>
            </div>
            <div class="col-md-7 py-5 wrap-about pb-md-5 ftco-animate">
                <div class="heading-section-bold mb-4 mt-md-5">
                    <div class="ml-md-0">
                        <h2 class="mb-4" [cmsText]="currentContent.heading"></h2>
                    </div>
                </div>
                <div class="pb-md-5">
                    <p [cmsXhtml]="currentContent.description"></p>
                    <p><a class="btn btn-primary" [cmsUrl]="currentContent.link">Shop now</a></p>
                </div>
            </div>
        </div>
    </div>
`
})
export class VideoComponent extends CmsComponent<VideoBlock> {
    constructor() {
        super();
    }
}
