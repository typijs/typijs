import { Content } from './content.model';
import { BlockData } from '../bases/content-data';

export class Block extends Content { }

export const mapToBlockData = (block: Block): BlockData => {
    return Object.assign(block.properties, <BlockData>{
        _id: block._id,
        parentId: block.parentId,
        contentType: block.contentType,
        contentName: block.name
    })
}
