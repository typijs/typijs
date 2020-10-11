import 'reflect-metadata';
import { Injectable } from 'injection-js';
import * as httpStatus from 'http-status';
import * as express from 'express';

import { IBlockDocument } from './models/block.model';
import { ContentController } from '../content/content.controller';
import { IBlockVersionDocument } from './models/block-version.model';
import { BlockService } from './block.service';
import { IBlockLanguageDocument } from './models/block-language.model';

@Injectable()
export class BlockController extends ContentController<IBlockDocument, IBlockLanguageDocument, IBlockVersionDocument> {

    private blockService: BlockService;
    constructor(blockService: BlockService) {
        super(blockService);
        this.blockService = blockService;
    }

    update = async (req: express.Request, res: express.Response) => {
        const blockDocument = Object.assign({ languageId: req.query.language }, req.body);
        const user = req['user'];
        const savedBlock = await this.blockService.executeUpdateContentFlow(req.params.id, blockDocument, user.id)
        res.status(httpStatus.OK).json(savedBlock)
    }
}