import { Injectable } from "injection-js";
import { ContentVersionService } from "../content/content-version.service";
import { ContentService } from "../content/content.service";
import { BlockLanguageModel, IBlockLanguageDocument } from "./models/block-language.model";
import { BlockVersionModel, IBlockVersionDocument } from "./models/block-version.model";
import { BlockModel, IBlockDocument } from "./models/block.model";

export class BlockVersionService extends ContentVersionService<IBlockVersionDocument> {
    constructor() {
        super(BlockVersionModel);
    }
}
export class BlockService extends ContentService<IBlockDocument, IBlockLanguageDocument, IBlockVersionDocument> {
    constructor() {
        super(BlockModel, BlockLanguageModel, BlockVersionModel);
    }
}