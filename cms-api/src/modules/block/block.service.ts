import { ContentService } from "../content/content.service";

import { IBlockDocument, BlockModel } from "./models/block.model";

import { IBlockVersionDocument, BlockVersionModel } from "./models/block-version.model";

import { IPublishedBlockDocument, PublishedBlockModel } from "./models/published-block.model";

export class BlockService extends ContentService<IBlockDocument, IBlockVersionDocument, IPublishedBlockDocument> {
    constructor() {
        super(BlockModel, BlockVersionModel, PublishedBlockModel);
    }
}