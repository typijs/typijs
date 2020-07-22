import * as express from 'express';
import * as multer from 'multer';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

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
    const fileName = request.params.fileId;
    const fileExt = path.extname(file.originalname);
    request.params.fileOriginalName = file.originalname;
    return `${fileName}${fileExt}`;
}

export const diskStorage = multer.diskStorage({
    destination: function (req: express.Request, file: Express.Multer.File, callback) {
        callback(null, generateFolder(req));
    },
    filename: function (req: express.Request, file: Express.Multer.File, callback) {
        callback(null, generateFileName(req, file));
    }
});
