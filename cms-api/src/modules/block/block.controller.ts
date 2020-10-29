import 'reflect-metadata';
import { Injectable } from 'injection-js';

import { IBlockDocument } from './models/block.model';
import { ContentController } from '../content/content.controller';
import { IBlockVersionDocument } from './models/block-version.model';
import { BlockService } from './block.service';
import { IBlockLanguageDocument } from './models/block-language.model';

@Injectable()
export class BlockController extends ContentController<IBlockDocument, IBlockLanguageDocument, IBlockVersionDocument> {
    constructor(blockService: BlockService) {
        super(blockService);
    }
}