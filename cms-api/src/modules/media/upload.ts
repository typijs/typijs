
import * as multer from 'multer';
import * as filter from './filter';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

export const UPLOAD_PATH = 'uploads';

const generateFolder = (request: any): string => {
    const fileId = mongoose.Types.ObjectId();
    request["fileId"] = fileId;
    const dir = path.join(UPLOAD_PATH, `${fileId}`);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;
}

const generateFileName = (request: any, file: any): string => {
    //const fileName = mongoose.Types.ObjectId();
    const fileName = request["fileId"];
    const fileExt = path.extname(file.originalname);
    request["fileOriginalName"] = file.originalname;
    return `${fileName}${fileExt}`;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, generateFolder(req));
    },
    filename: function (req, file, cb) {
        cb(null, generateFileName(req, file));
    }
});

export const uploadFile = multer({ storage: storage, fileFilter: filter.ignoreDangerousFileFilter });
export const uploadImage = multer({ storage: storage, fileFilter: filter.imageFilter });
export const uploadVideo = multer({ storage: storage, fileFilter: filter.videoFilter });
export const uploadDoc = multer({ storage: storage, fileFilter: filter.docFilter });
