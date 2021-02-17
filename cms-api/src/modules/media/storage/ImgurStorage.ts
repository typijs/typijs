import * as concat from "concat-stream";
import { Request } from "express";
import * as mongoose from 'mongoose';
import { Stream } from "stream";

import { imgurClient } from '../../../http/ImgurClient';
import { CmsStorageEngine } from "./BaseStorage";

export interface MulterInFile extends Express.Multer.File {
    stream: Stream;
}

export interface MulterOutFile extends Express.Multer.File {
    id: string;
    title: string;
    description: string;
    type: string;
    deleteHash: string;
    name: string;
    linkUrl: string;
    fileId: string;
    thumbnail: string;
}

const getImgurThumbnail = (link: string): string => {
    const lastIndex = link.lastIndexOf('.');
    const extension = link.substring(lastIndex + 1);
    const path = link.substring(0, lastIndex);
    return `${path}b.${extension}`
}

export class ImgurStorageEngine extends CmsStorageEngine {
    async _handleFile(req: Request, file: MulterInFile, callback: (error?: any, info?: Partial<MulterOutFile>) => void) {
        //collect all the data from a stream into a single buffer.
        file.stream.pipe(concat({ encoding: 'buffer' }, function (buffer) {
            const encoded = buffer.toString('base64')
            imgurClient.uploadImage(encoded)
                .then(function (response) {
                    const { id, title, description, type, deletehash, name, link } = response.data;
                    const fileId = mongoose.Types.ObjectId().toHexString();
                    const thumbnail = getImgurThumbnail(link);
                    Object.assign(req.body, { fileId, thumbnail, linkUrl: link })
                    callback(null, { id, title, description, type, deleteHash: deletehash, name, linkUrl: link, fileId, thumbnail })
                })
                .catch(function (error) {
                    callback(error);
                });
        }))
    }

    async _removeFile(req: Request, file: MulterOutFile, callback: (error: Error) => void) {
        //Remove file from imgur if existing
    }
}