
import { Stream } from "stream";
import { Request } from "express";
import * as concat from "concat-stream";
import { StorageEngine } from "multer";

import { imgurClient } from '../../http/ImgurClient';


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
    link: string
}

export class ImgurMulterStorageEngine implements StorageEngine {
    async _handleFile(req: Request, file: MulterInFile, cb: (error?: any, info?: Partial<MulterOutFile>) => void) {
        //collect all the data from a stream into a single buffer.
        file.stream.pipe(concat({ encoding: 'buffer' }, function (buffer) {
            const encoded = buffer.toString('base64')
            imgurClient.uploadImage(encoded)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    const { id, title, description, type, deletehash, name, link } = response.data;
                    cb(null, { id, title, description, type, deleteHash: deletehash, name, link })
                })
                .catch(function (error) {
                    console.log(error);
                    cb(error);
                });
        }))
    }

    async _removeFile(req: Request, file: MulterOutFile, cb: (error: Error) => void) {
        //Remove file from imgur if existing
    }
}
