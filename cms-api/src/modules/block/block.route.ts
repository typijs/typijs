import { Router } from 'express';
import { Injectable } from 'injection-js';
import 'reflect-metadata';
import { asyncRouterErrorHandler } from '../../error';
import { LanguageGuard } from '../language';
import { BlockController } from './block.controller';

@Injectable()
export class BlockRouter {
    constructor(private blockController: BlockController, private langGuard: LanguageGuard) { }

    get router(): Router {
        const block: Router = asyncRouterErrorHandler(Router());

        block.get('/folders/:parentId?', this.blockController.getFoldersByParentId.bind(this.blockController));

        block.get('/children/:parentId?', this.langGuard.checkEnabled(), this.blockController.getContentChildren.bind(this.blockController));

        block.post('/folder', this.blockController.createFolderContent.bind(this.blockController));

        block.put('/folder/:id', this.blockController.updateFolderName.bind(this.blockController));

        block.get('/:id', this.langGuard.checkEnabled(), this.blockController.getContent.bind(this.blockController));

        block.post('/cut', this.blockController.cut.bind(this.blockController));

        block.post('/copy', this.blockController.copy.bind(this.blockController));

        block.post('/', this.langGuard.checkEnabled(), this.blockController.createContent.bind(this.blockController));

        //move to trash
        block.put('/trash/:id', this.blockController.moveToTrash.bind(this.blockController));

        block.delete('/:id', this.blockController.deleteContent.bind(this.blockController));
        return block
    }

    get versionRouter(): Router {
        const blockVersion: Router = asyncRouterErrorHandler(Router());
        //get all versions of content
        blockVersion.get('/list/:id', this.blockController.getAllVersionsOfContent.bind(this.blockController));
        //get version detail
        blockVersion.get('/:id', this.langGuard.checkEnabled(), this.blockController.getVersion.bind(this.blockController));
        //update version
        blockVersion.put('/:id', this.blockController.updateVersion.bind(this.blockController));
        //set version is primary
        blockVersion.put('/set-primary/:versionId', this.blockController.setVersionIsPrimary.bind(this.blockController));
        //publish version
        blockVersion.put('/publish/:id', this.blockController.publishVersion.bind(this.blockController));
        //delete version
        blockVersion.delete('/:versionId', this.blockController.deleteContent.bind(this.blockController))
        return blockVersion;
    }
}