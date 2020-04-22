import 'reflect-metadata';
import { Injectable } from 'injection-js';
import * as httpStatus from 'http-status';
import * as express from 'express';

import { IBlockDocument } from './models/block.model';
import { ContentController } from '../content/content.controller';
import { IBlockVersionDocument } from './models/block-version.model';
import { IPublishedBlockDocument } from './models/published-block.model';
import { BlockService } from './block.service';

@Injectable()
export class BlockController extends ContentController<IBlockDocument, IBlockVersionDocument, IPublishedBlockDocument> {

    private blockService: BlockService;
    constructor(blockService: BlockService) {
        super(blockService);
        this.blockService = blockService;
    }

    update = async (req: express.Request, res: express.Response) => {
        const blockDocument = this.blockService.createModelInstance(req.body);
        const savedBlock = await this.blockService.updateAndPublishContent(req.params.id, blockDocument)
        res.status(httpStatus.OK).json(savedBlock)
    }
}