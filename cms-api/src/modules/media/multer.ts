
import * as multer from 'multer';
import { imgurStorage, diskStorage } from './storage';

export const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

export const videoFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(avi|flv|wmv|mov|mp4)$/)) {
        return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
};

export const docFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(doc|docx|xls|xlsx)$/)) {
        return cb(new Error('Only doc files are allowed!'), false);
    }
    cb(null, true);
};


export const ignoreDangerousFileFilter = function (req, file, cb) {
    // accept image only
    if (file.originalname.match(/\.(exe|pif|application|msi|msp|com|scr|hta|cpl|msc|jar|gadget|bat|cmd|vb|vbs|vbe|jse|ws|wsf|wsc|wsh|ps1|ps2|psc1|psc2|scf|lnk|inf|reg)$/)) {
        return cb(new Error('Dangerous files are not allowed!'), false);
    }
    cb(null, true);
};

export const uploadFile = multer({ storage: imgurStorage, fileFilter: ignoreDangerousFileFilter });
export const uploadImage = multer({ storage: diskStorage, fileFilter: imageFilter });
export const uploadVideo = multer({ storage: diskStorage, fileFilter: videoFilter });
export const uploadDoc = multer({ storage: diskStorage, fileFilter: docFilter });
