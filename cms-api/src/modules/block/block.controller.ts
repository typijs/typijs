import * as express from 'express';

import { IBlockDocument } from './models/block.model';
import { ContentController } from '../content/content.controller';
import { IBlockVersionDocument } from './models/block-version.model';
import { IPublishedBlockDocument } from './models/published-block.model';
import { BlockService } from './block.service';

export class BlockController extends ContentController<IBlockDocument, IBlockVersionDocument, IPublishedBlockDocument> {

    private blockService: BlockService;
    constructor(blockService: BlockService) {
        super(blockService);
        this.blockService = blockService;
    }

    update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const pageDocument = this.blockService.createModelInstance(req.body);

        this.blockService.updateAndPublishContent(req.params.id, pageDocument)
            .then((savedPage: IBlockDocument) => res.status(200).json(savedPage))
            .catch(error => next(error));
    }
}