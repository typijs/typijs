import { Content } from '@angular-cms/core';

import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TypeOfContent } from '.';
/**
 * Extend the TreeNode interface from Tree lib
 */
declare module '../shared/tree/interfaces/tree-node' {
    interface TreeNode {
        type: TypeOfContent;
        contentType: string;
        isPublished: boolean;
        linkUrl?: string;
        alt?: string;
        thumbnail?: string;
        src?: string;
    }

    namespace TreeNode {
        /**
         * Create TreeNode object from Content object
         *
         * @param content
         * @param type
         */
        export function createInstanceFromContent(content: Content, type: TypeOfContent): TreeNode;
    }
}

/**
 * Reference http://sapandiwakar.in/adding-static-methods-to-existing-modules-using-declaration-merging-in-typescript/
 */
TreeNode.createInstanceFromContent = (content: Content, type: TypeOfContent): TreeNode => {
    return new TreeNode({
        id: content._id,
        name: content.name,
        hasChildren: content.hasChildren,
        parentId: content.parentId,
        parentPath: content.parentPath,
        type: type,
        contentType: content.contentType,
        isPublished: content.isPublished,
        linkUrl: content['linkUrl'],
        alt: content.name,
        src: content['linkUrl'],
        thumbnail: content['thumbnail'],
    });
};
