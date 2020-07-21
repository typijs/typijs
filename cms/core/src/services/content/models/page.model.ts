import { Content } from './content.model';
import { PageData } from './content-data';

export class Page extends Content {
    urlSegment: string;
    linkUrl: string;
    publishedLinkUrl?: string;

    isVisibleOnSite: boolean;
    sortIndex: number;
    childrenSortCriteria: string;
}

export const mapToPageData = (page: Page): PageData => {
    return Object.assign(<PageData>{
        id: page._id,
        linkUrl: page.publishedLinkUrl,
        parentId: page.parentId,
        urlSegment: page.urlSegment,
        contentType: page.contentType,
        name: page.name
    }, page.properties)
}
