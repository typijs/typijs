import * as path from 'path';
import * as fs from 'fs';
import * as sharp from "sharp";

import * as upload from './upload';

import { IMediaDocument, MediaModel, ImageContent } from "./models/media.model";
import { ContentService } from "../content/content.service";
import { IMediaVersionDocument, MediaVersionModel } from "./models/media-version.model";
import { IPublishedMediaDocument, PublishedMediaModel } from "./models/published-media.model";

export class MediaService extends ContentService<IMediaDocument, IMediaVersionDocument, IPublishedMediaDocument> {

    constructor() {
        super(MediaModel, MediaVersionModel, PublishedMediaModel);
    }

    public createReadMediaStream = (fileId: string, fileName: string, width?: number, height?: number): Promise<fs.ReadStream> => {
        const fileExt = path.extname(fileName);
        return this.getPopulatedPublishedContentById(fileId)
            .then((publishedMedia: IPublishedMediaDocument) => {
                if (!publishedMedia) return null;

                if (publishedMedia.contentType == ImageContent) return this.getResizedImageStream(fileId, fileExt, width, height);

                return this.getMediaStream(fileId, fileExt);
            })
    }

    private getMediaStream = (fileId: string, fileExt: string): Promise<fs.ReadStream> => {
        const fileOriginalPath = path.join(upload.UPLOAD_PATH, fileId, `${fileId}${fileExt}`);
        return this.existsFile(fileOriginalPath)
            .then((isExisted: boolean) => isExisted ? fs.createReadStream(fileOriginalPath) : null)
    }

    private getResizedImageStream = (fileId: string, fileExt: string, width: number | undefined, height: number | undefined): Promise<fs.ReadStream> => {
        const fileOriginalPath = path.join(upload.UPLOAD_PATH, fileId, `${fileId}${fileExt}`);
        const fileResizedPath = width || height ? path.join(upload.UPLOAD_PATH, fileId, `${fileId}_${width}x${height}${fileExt}`) : fileOriginalPath;
        //check existing the fileResizedPath
        //If not execute resize image at fileResizedPath
        //create stream reader from fileResizedPath
        return this.existsFile(fileResizedPath)
            .then((isExisted: boolean) => {
                if (isExisted) return fs.createReadStream(fileResizedPath);

                if (width || height) return this.resizeImage(fileOriginalPath, fileResizedPath, width, height).then(() => fs.createReadStream(fileResizedPath));

                return null;
            })
    }

    private existsFile = (filePath: string): Promise<boolean> => {
        return fs.promises.access(filePath, fs.constants.F_OK)
            .then(() => true)
            .catch(err => false)
    }

    private resizeImage = (originalImagePath: string, resizedImagePath: string, width: number = 100, height: number = 100, options?: sharp.ResizeOptions): Promise<sharp.OutputInfo> => {
        return sharp(originalImagePath)
            .resize(width, height, options)
            //.max()
            .toFormat('jpeg')
            .webp()
            .toFile(resizedImagePath)
    }
}