
import * as express from 'express';
import * as multer from 'multer';
import * as filter from './filter';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import { ImgurMulterStorageEngine } from './ImgurStorageEngine';

export const UPLOAD_PATH = 'uploads';

const generateFolder = (request: express.Request): string => {
    const fileId = mongoose.Types.ObjectId();
    request.params.fileId = fileId.toHexString();
    const dir = path.join(UPLOAD_PATH, `${fileId}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}

const generateFileName = (request: express.Request, file: Express.Multer.File): string => {
    //const fileName = mongoose.Types.ObjectId();
    const fileName = request.params.fileId;
    const fileExt = path.extname(file.originalname);
    request.params.fileOriginalName = file.originalname;
    return `${fileName}${fileExt}`;
}

const storage = multer.diskStorage({
    destination: function (req: express.Request, file: Express.Multer.File, callback) {
        callback(null, generateFolder(req));
    },
    filename: function (req: express.Request, file: Express.Multer.File, callback) {
        callback(null, generateFileName(req, file));
    }
});

const imgurStorageEngine = new ImgurMulterStorageEngine();

export const uploadFile = multer({ storage: imgurStorageEngine, fileFilter: filter.ignoreDangerousFileFilter });
export const uploadImage = multer({ storage: storage, fileFilter: filter.imageFilter });
export const uploadVideo = multer({ storage: storage, fileFilter: filter.videoFilter });
export const uploadDoc = multer({ storage: storage, fileFilter: filter.docFilter });
