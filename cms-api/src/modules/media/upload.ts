
import * as multer from 'multer';
import * as filter from './filter';
import * as mongoose from 'mongoose';
import * as path from 'path';

const UPLOAD_PATH = 'uploads';

const generateFileName = (request: any, file: any): string => {
    const fileName = mongoose.Types.ObjectId();
    const fileExt = path.extname(file.originalname);
    request["fileName"] = fileName;
    request["fileOriginalName"] = file.originalname;
    return `${fileName}${fileExt}`;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${UPLOAD_PATH}/`)
    },
    filename: function (req, file, cb) {
        cb(null, generateFileName(req, file));
    }
});

export const uploadFile = multer({ storage: storage, fileFilter: filter.ignoreDangerousFileFilter });
export const uploadImage = multer({ storage: storage, fileFilter: filter.imageFilter });
export const uploadVideo = multer({ storage: storage, fileFilter: filter.videoFilter });
export const uploadDoc = multer({ storage: storage, fileFilter: filter.docFilter });
