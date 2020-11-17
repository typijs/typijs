import 'reflect-metadata';
import { Injectable } from 'injection-js';
import * as express from 'express';
import * as mime from 'mime-types';
import * as httpStatus from 'http-status';

import { ContentController } from '../content/content.controller';
import { MediaService } from './media.service';
import { IMediaVersionDocument, MediaVersionModel } from './models/media-version.model';
import {
    FileContent,
    ImageContent,
    IMediaDocument,
    VideoContent
} from './models/media.model';
import { Multer } from './multer';
import { IMediaLanguageDocument } from './models/media-language.model';
import { ContentVersionService } from '../content/content-version.service';

@Injectable()
export class MediaController extends ContentController<IMediaDocument, IMediaLanguageDocument, IMediaVersionDocument> {

    constructor(private mediaService: MediaService, private multer: Multer) {
        super(mediaService, new ContentVersionService<IMediaVersionDocument>(MediaVersionModel));
    }

    getMediaById = async (req: express.Request, res: express.Response) => {
        const widthStr = req.query.w ? req.query.w : req.query.width;
        const heightStr = req.query.h ? req.query.h : req.query.height;
        const width = widthStr ? parseInt(widthStr, 10) : undefined;
        const height = heightStr ? parseInt(heightStr, 10) : undefined;

        const fileId = req.params.fileId;
        const fileName = req.params.fileName;

        const stream = await this.mediaService.createReadMediaStream(fileId, fileName, width, height)
        if (stream) {
            res.writeHead(httpStatus.OK, { 'Content-type': mime.lookup(fileName) });
            stream.pipe(res);
        } else {
            res.status(httpStatus.NOT_FOUND).json(`${httpStatus.NOT_FOUND}-File Not Found`);
        }
    }

    handleFormData = (fieldName: string): any => {
        if (!fieldName) fieldName = 'file';
        return this.multer.uploadFile.single(fieldName);
    }

    processMedia = async (req: express.Request, res: express.Response) => {
        const file: Express.Multer.File = req.file;
        const contentType: string = this.getMediaContentType(file.originalname);
        const { parentId, fileId, linkUrl, thumbnail } = req.params;
        const { user, language } = req as any;
        const mediaObj: Partial<IMediaDocument & IMediaLanguageDocument> = {
            _id: fileId,
            name: file.originalname,
            parentId,
            mimeType: file.mimetype,
            size: file.size,
            contentType,
            cloudId: file['id'],
            deleteHash: file['deleteHash'],
            linkUrl,
            thumbnail
        }

        const savedMedia = await this.mediaService.executeCreateContentFlow(mediaObj as any, user.id, language);

        const publishedMedia = await this.mediaService.executePublishContentFlow(savedMedia._id, savedMedia.versionId, user.id, language);
        res.status(httpStatus.OK).json(publishedMedia)
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