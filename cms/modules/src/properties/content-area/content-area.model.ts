import { TypeOfContent } from '../../types';

export interface ContentAreaItem {
    // mongoose Object id
    _id: string;
    // guid id in this content area
    guid: string;
    // belong to which content area
    owner: string;
    name: string;
    // type of content area item
    type: TypeOfContent;
    contentType: string;
    isPublished: boolean;
}
