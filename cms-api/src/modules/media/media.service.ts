import * as fs from 'fs';
import * as path from 'path';
import * as sharp from "sharp";

import { ContentService } from "../content/content.service";
import { IMediaVersionDocument, MediaVersionModel } from "./models/media-version.model";
import { ImageContent, IMediaDocument, MediaModel } from "./models/media.model";
import { IPublishedMediaDocument, PublishedMediaModel } from "./models/published-media.model";
import { UPLOAD_PATH } from './multerUpload';


export class MediaService extends ContentService<IMediaDocument, IMediaVersionDocument, IPublishedMediaDocument> {

    constructor() {
        super(MediaModel, MediaVersionModel, PublishedMediaModel);
    }

    public createReadMediaStream = async (fileId: string, fileName: string, width?: number, height?: number): Promise<fs.ReadStream> => {
        const fileExt = path.extname(fileName);
        const publishedMedia = await this.getPopulatedPublishedContentById(fileId);
        if (!publishedMedia) return null;

        if (publishedMedia.contentType == ImageContent) return await this.getResizedImageStream(fileId, fileExt, width, height);

        return await this.getMediaStream(fileId, fileExt);
    }

    private getMediaStream = async (fileId: string, fileExt: string): Promise<fs.ReadStream> => {
        const fileOriginalPath = path.join(UPLOAD_PATH, fileId, `${fileId}${fileExt}`);
        const isExisted = await this.existsFile(fileOriginalPath);
        return isExisted ? fs.createReadStream(fileOriginalPath) : null;
    }

    private getResizedImageStream = async (fileId: string, fileExt: string, width?: number, height?: number): Promise<fs.ReadStream> => {
        const fileOriginalPath = path.join(UPLOAD_PATH, fileId, `${fileId}${fileExt}`);
        const fileResizedPath = width || height ? path.join(UPLOAD_PATH, fileId, `${fileId}_${width}x${height}${fileExt}`) : fileOriginalPath;
        //check existing the fileResizedPath
        const isExisted = await this.existsFile(fileResizedPath);
        if (isExisted) return fs.createReadStream(fileResizedPath);
        //If not execute resize image at fileResizedPath
        //create stream reader from fileResizedPath
        if (width || height) {
            const output = await this.resizeImage(fileOriginalPath, fileResizedPath, width, height);
            return output ? fs.createReadStream(fileResizedPath) : null;
        }
        return null;
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