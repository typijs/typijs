import { Pipe, PipeTransform } from '@angular/core';
import { ContentReference } from '../types/content-reference';
import { CmsUrl } from '../types/cms-url';
import { ContentTypeEnum } from '../constants/content-type.enum';

/**
 * The pipe to convert the ContentReference of PageData to `CmsUrl` object
 */
@Pipe({
    name: 'toUrl'
})
export class ToUrlPipe implements PipeTransform {

    transform(value: ContentReference): CmsUrl {
        const urlItem = new CmsUrl();
        urlItem.urlType = ContentTypeEnum.Page;
        urlItem.page = value;
        return urlItem;
    }
}
