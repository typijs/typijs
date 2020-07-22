import * as express from 'express';
import * as multer from 'multer';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

export const UPLOAD_PATH = 'uploads';

const generateFolder = (request: express.Request, file: Express.Multer.File): string => {
    const fileId = mongoose.Types.ObjectId();
    Object.apply(file, { fileId });
    //request.params.fileId = fileId.toHexString();
    const dir = path.join(UPLOAD_PATH, `${fileId}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}

const generateFileName = (request: express.Request, file: Express.Multer.File): string => {
    const fileId = file['fileId'];
    const fileExt = path.extname(file.originalname);
    const link = getLink(fileId, file.originalname);
    const thumbnail = `${link}?w=50&h=50`;
    Object.apply(file, { link, thumbnail });
    //request.params.fileOriginalName = file.originalname;
    return `${fileId}${fileExt}`;
}

const getLink = (fileId: string, fileName: string): string => {
    return `api/assets/${fileId}/${fileName}`;
}

export const diskStorage = multer.diskStorage({
    destination: function (req: express.Request, file: Express.Multer.File, callback) {
        callback(null, generateFolder(req, file));
    },
    filename: function (req: express.Request, file: Express.Multer.File, callback) {
        callback(null, generateFileName(req, file));
    }
});
