import { Pipe, PipeTransform } from '@angular/core';
import { ContentReference } from '../types/content-reference';
import { CmsUrl } from '../types/cms-url';

/**
 * The pipe to convert the ContentReference or url to absolute image source
 */
@Pipe({
    name: 'toUrl'
})
export class ToUrlPipe implements PipeTransform {

    transform(value: ContentReference): CmsUrl {
        const urlItem = new CmsUrl();
        urlItem.urlType = 'page';
        urlItem.page = value;
        return urlItem;
    }
}
