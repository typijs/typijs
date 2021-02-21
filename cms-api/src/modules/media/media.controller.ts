import * as Joi from '@hapi/joi';
import * as express from 'express';
import * as httpStatus from 'http-status';
import { Injectable } from 'injection-js';
import * as mime from 'mime-types';
import 'reflect-metadata';
import { Profiler } from '../../logging';
import { slugify } from '../../utils';
import { ValidateBody, ValidateParams } from '../../validation/validate.decorator';
import { ContentVersionService } from '../content/content-version.service';
import { ContentController } from '../content/content.controller';
import { MediaService } from './media.service';
import { IMediaVersionDocument, MediaVersionModel } from './models/media-version.model';
import {
    FileContent,
    ImageContent,
    IMediaDocument,
    IMediaLanguageDocument,
    VideoContent
} from './models/media.model';
import { Multer } from './multer';

@Injectable()
export class MediaController extends ContentController<IMediaDocument, IMediaLanguageDocument, IMediaVersionDocument> {

    constructor(private mediaService: MediaService, private multer: Multer) {
        super(mediaService, new ContentVersionService<IMediaVersionDocument>(MediaVersionModel));
    }

    @ValidateParams({
        fileId: Joi.string().required(),
        fileName: Joi.string().required()
    })
    async getMediaById(req: express.Request, res: express.Response) {
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

    handleFormData(fieldName: string): any {
        if (!fieldName) fieldName = 'file';
        return this.multer.uploadFile.single(fieldName);
    }

    @ValidateBody({
        fileId: Joi.string().required(),
        linkUrl: Joi.string().required(),
        thumbnail: Joi.string().required()
    })
    async processMedia(req: express.Request, res: express.Response) {
        const file: Express.Multer.File = req.file;
        const contentType: string = this.getMediaContentType(file.originalname);
        const { parentId } = req.params;
        const { fileId, linkUrl, thumbnail } = req.body;
        const { user, language } = req as any;
        const mediaObj: Partial<IMediaDocument & IMediaLanguageDocument> = {
            _id: fileId,
            name: file.originalname,
            parentId: parentId === '0' ? null : parentId,
            mimeType: file.mimetype,
            size: file.size,
            contentType,
            cloudId: file['id'],
            deleteHash: file['deleteHash'],
            linkUrl,
            thumbnail,
            urlSegment: slugify(file.originalname)
        }

        const savedMedia = await this.mediaService.executeCreateContentFlow(mediaObj as any, language, user.id);

        const publishedMedia = await this.mediaService.executePublishContentFlow(savedMedia._id.toString(), savedMedia.versionId, user.id);
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