import 'reflect-metadata';
import { Injectable } from 'injection-js';

import { IBlockDocument, IBlockLanguageDocument } from './models/block.model';
import { ContentController } from '../content/content.controller';
import { IBlockVersionDocument } from './models/block-version.model';
import { BlockService, BlockVersionService } from './block.service';

@Injectable()
export class BlockController extends ContentController<IBlockDocument, IBlockLanguageDocument, IBlockVersionDocument> {
    constructor(blockService: BlockService, versionService: BlockVersionService) {
        super(blockService, versionService);
    }
}