import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { isNullOrWhiteSpace, isUrlAbsolute } from '../helpers/common';
import { TypeCheck } from '../helpers/type-check';
import { CmsImage } from '../types/image-reference';

/**
 * The pipe to convert the cmsImage object or url to absolute image source
 */
@Pipe({
    name: 'toImgSrc'
})
export class ToImgSrcPipe implements PipeTransform {
    constructor(private configService: ConfigService) { }

    transform(value: string | CmsImage): string {

        if (TypeCheck.isString(value)) {
            const src = value as string;
            if (isNullOrWhiteSpace(src)) { return ''; }
            if (isUrlAbsolute(src)) { return src; }
            return `${this.configService.baseApiUrl}${src}`;
        }

        const cmsImage = value as CmsImage;
        if (!cmsImage || isNullOrWhiteSpace(cmsImage.src)) { return ''; }

        if (isUrlAbsolute(cmsImage.src)) { return cmsImage.src; }
        return `${this.configService.baseApiUrl}${cmsImage.src}`;
    }
}
