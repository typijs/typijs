import { Component, HostBinding } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';
import { CmsImage } from '../../types';

@Component({
    selector: 'img',
    template: ``
})
export class ImageRender extends CmsPropertyRender {
    @HostBinding('attr.src') src; 
    @HostBinding('attr.alt') alt; 
    get cmsImage(): CmsImage {
        return this.value ? this.value : {}
    }

    protected onValueChange(value: any) {
        if(value) {
            this.src = value.src;
            this.alt = value.alt;
        }
    }
}