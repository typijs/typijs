import * as express from 'express';
import * as mime from 'mime-types';

import { ContentController } from '../content/content.controller';
import { MediaService } from './media.service';
import { IMediaVersionDocument } from './models/media-version.model';
import {
    FileContent,
    ImageContent,
    IMediaDocument,
    VideoContent
} from './models/media.model';
import { IPublishedMediaDocument } from './models/published-media.model';
import { uploadFile } from './upload';


export class MediaController extends ContentController<IMediaDocument, IMediaVersionDocument, IPublishedMediaDocument> {

    private mediaService: MediaService;
    constructor(mediaService: MediaService) {
        super(mediaService);
        this.mediaService = mediaService;
    }

    getMediaById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const widthStr = req.query.w ? req.query.w : req.query.width;
        const heightStr = req.query.h ? req.query.h : req.query.height;
        const width = widthStr ? parseInt(widthStr, 10) : undefined;
        const height = heightStr ? parseInt(heightStr, 10) : undefined;

        const fileId = req.params.fileId;
        const fileName = req.params.fileName;

        try {
            const stream = await this.mediaService.createReadMediaStream(fileId, fileName, width, height)
            if (stream) {
                res.writeHead(200, { 'Content-type': mime.lookup(fileName) });
                stream.pipe(res);
            } else {
                res.status(404).json("404 - File Not Found");
            }
        } catch (error) {
            next(error);
        }
    }

    uploadMedia = (fieldName: string): any => {
        if (!fieldName) fieldName = 'file';
        return uploadFile.single(fieldName);
    }

    processMedia = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const file: Express.Multer.File = req.file;
        const mediaObj: Partial<IMediaDocument> = {
            _id: req.params.fileId,
            name: req.params.fileOriginalName,
            parentId: req.params.parentId,
            mimeType: file.mimetype,
            size: file.size,
            contentType: this.getMediaContentType(req.params.fileOriginalName)
        }
        try {
            const mediaDocument = this.mediaService.createModelInstance(mediaObj);
            const savedMedia = await this.mediaService.executeCreateContentFlow(mediaDocument);
            const publishedMedia = await this.mediaService.executePublishContentFlow(savedMedia);
            res.status(200).json(publishedMedia)

        } catch (error) {
            next(error);
        }
    }

    private getMediaContentType = (fileName: string) => {
        if (!fileName) return FileContent;

        if (fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
            return ImageContent;
        }
        if (fileName.toLowerCase().match(/\.(avi|flv|wmv|mov|mp4)$/)) {
            return VideoContent;
        }

        return FileContent
    }
}