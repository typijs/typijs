import { Injectable } from "injection-js";
import { ContentVersionService } from "../content/content-version.service";
import { ContentService } from "../content/content.service";
import { BlockVersionModel, BlockVersionSchema, IBlockVersionDocument } from "./models/block-version.model";
import { BlockModel, BlockSchema, cmsBlock, cmsBlockVersion, IBlockDocument, IBlockLanguageDocument } from "./models/block.model";

export class BlockVersionService extends ContentVersionService<IBlockVersionDocument> {
    constructor() {
        super(BlockVersionModel, cmsBlockVersion, BlockVersionSchema);
    }
}

@Injectable()
export class BlockService extends ContentService<IBlockDocument, IBlockLanguageDocument, IBlockVersionDocument> {
    constructor(blockVersionService: BlockVersionService) {
        super(BlockModel, cmsBlock, BlockSchema);
        this.contentVersionService = blockVersionService;
    }
}