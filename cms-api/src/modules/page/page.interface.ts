import { IContent } from "../content";

export interface IPage extends IContent {
    urlSegment: string;
    linkUrl: string;
    
    ancestors: string[];
    childItems: any[];

    isPublished: boolean;

    isVisibleOnSite: boolean;
    sortIndex: number;
    childrenSortCriteria: string;
    
    published: Date;
    publishedBy: any;
}

