
import * as express from 'express';

import { BlockModel, IBlockDocument } from './models/block.model';
import { ContentCtrl } from '../content/content.controller';
import { ContentService } from '../content/content.service';
import { IBlockVersionDocument, BlockVersionModel } from './models/block-version.model';
import { IPublishedBlockDocument, PublishedBlockModel } from './models/published-block.model';

export class BlockCtrl extends ContentCtrl<IBlockDocument, IBlockVersionDocument, IPublishedBlockDocument> {

    private blockService: ContentService<IBlockDocument, IBlockVersionDocument, IPublishedBlockDocument>;
    constructor() {
        super(BlockModel, BlockVersionModel, PublishedBlockModel);
        this.blockService = new ContentService(BlockModel, BlockVersionModel, PublishedBlockModel);
    }

    update = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const pageDocument = this.blockService.createModelInstance(req.body);

        this.blockService.updateAndPublishContent(req.params.id, pageDocument)
            .then((savedPage: IBlockDocument) => res.status(200).json(savedPage))
            .catch(error => next(error));
    }
}