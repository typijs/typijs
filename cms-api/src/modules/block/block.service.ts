import { ContentService } from "../content/content.service";

import { IBlockDocument, BlockModel } from "./models/block.model";

import { IBlockVersionDocument, BlockVersionModel } from "./models/block-version.model";
import { BlockLanguageModel, IBlockLanguageDocument } from "./models/block-language.model";

export class BlockService extends ContentService<IBlockDocument, IBlockLanguageDocument, IBlockVersionDocument> {
    constructor() {
        super(BlockModel, BlockLanguageModel, BlockVersionModel);
    }
}