import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { AdminOrEditor } from '../../constants';
import { asyncRouterErrorHandler } from '../../error';
import { AuthGuard } from '../auth';
import { LanguageGuard } from '../language';
import { MediaController } from './media.controller';

@Injectable()
export class MediaRouter {
    constructor(private mediaController: MediaController, private authGuard: AuthGuard, private langGuard: LanguageGuard) { }

    get router(): Router {
        const media: Router = asyncRouterErrorHandler(Router());

        media.get('/folders/:parentId?', this.mediaController.getFoldersByParentId.bind(this.mediaController));

        media.get('/children/:parentId?', this.langGuard.checkEnabled(), this.mediaController.getContentChildren.bind(this.mediaController));

        media.post('/folder', this.mediaController.createFolderContent.bind(this.mediaController));

        media.put('/folder/:id', this.mediaController.updateFolderName.bind(this.mediaController));

        media.get('/:id', this.langGuard.checkEnabled(), this.mediaController.getContent.bind(this.mediaController));

        media.post('/upload/:parentId?', this.authGuard.checkRoles(AdminOrEditor), this.langGuard.checkEnabled(), this.mediaController.handleFormData('file'), this.mediaController.processMedia.bind(this.mediaController))

        media.post('/cut', this.mediaController.cut.bind(this.mediaController));

        media.post('/copy', this.mediaController.copy.bind(this.mediaController));

        //query contents
        media.post('/query', this.langGuard.checkEnabled(), this.mediaController.queryContent.bind(this.mediaController));
        //TODO need to revisit
        media.get('/:id', this.mediaController.getVersion.bind(this.mediaController));
        //move to trash
        media.put('/trash/:id', this.mediaController.moveToTrash.bind(this.mediaController));

        media.delete('/:id', this.mediaController.deleteContent.bind(this.mediaController));
        return media
    }

    get assetRouter(): Router {
        const asset: Router = asyncRouterErrorHandler(Router());
        asset.get('/:fileId/:fileName', this.mediaController.getMediaById.bind(this.mediaController));
        return asset;
    }
}