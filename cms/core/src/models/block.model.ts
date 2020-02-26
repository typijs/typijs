import { Content } from './content.model';
import { BlockData } from '../bases/content-data';

export class Block extends Content { }

export const mapToBlockData = (block: Block): BlockData => {
    return Object.assign(block.properties, <BlockData>{
        id: block._id,
        parentId: block.parentId,
        contentType: block.contentType,
        name: block.name
    })
}
