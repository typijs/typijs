import { Content } from './content.model';
import { PageData } from '../bases/page-data';

export class Page extends Content {
    urlSegment: string;
    linkUrl: string;
    publishedLinkUrl?: string;

    isVisibleOnSite: boolean;
    sortIndex: number;
    childrenSortCriteria: string;
}

export const mapToPageData = (page: Page): PageData => {
    return Object.assign(page.properties, <PageData>{
        _id: page._id,
        linkUrl: page.publishedLinkUrl,
        parentId: page.parentId,
        nameInUrl: page.urlSegment,
        contentType: page.contentType,
        contentName: page.name
    })
}
