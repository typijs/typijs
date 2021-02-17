import { Content } from './content.model';

export interface Page extends Content {
    // IPage
    visibleInMenu: boolean;
    // IPageLanguage
    urlSegment: string;
    simpleAddress: string;

    linkUrl: string;
}
