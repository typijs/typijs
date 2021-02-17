import { Pipe, PipeTransform } from '@angular/core';
import { ContentReference } from '../types/content-reference';
import { UrlItem } from '../types/url-item';

/**
 * The pipe to convert the ContentReference or url to absolute image source
 */
@Pipe({
    name: 'toPageUrl'
})
export class ToPageUrlPipe implements PipeTransform {

    transform(value: ContentReference): UrlItem {
        const urlItem = new UrlItem();
        urlItem.urlType = 'page';
        urlItem.page = value;
        return urlItem;
    }
}
