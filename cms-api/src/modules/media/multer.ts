
import * as express from 'express';
import { Injectable } from 'injection-js';
import * as multer from 'multer';
import { CmsStorageEngine, diskStorage } from './storage';

@Injectable()
export class Multer {
    constructor(private storageEngine: CmsStorageEngine) { }

    get uploadFile(): multer.Instance {
        return multer({ storage: this.storageEngine, fileFilter: this.ignoreDangerousFileFilter });
    }
    get uploadImage(): multer.Instance {
        return multer({ storage: diskStorage, fileFilter: this.imageFilter })
    };
    get uploadVideo(): multer.Instance {
        return multer({ storage: diskStorage, fileFilter: this.videoFilter });
    }
    get uploadDoc(): multer.Instance {
        return multer({ storage: diskStorage, fileFilter: this.docFilter });
    }

    private ignoreDangerousFileFilter = (req: express.Request, file: Express.Multer.File, cb) => {
        // accept image only
        if (file.originalname.match(/\.(exe|pif|application|msi|msp|com|scr|hta|cpl|msc|jar|gadget|bat|cmd|vb|vbs|vbe|jse|ws|wsf|wsc|wsh|ps1|ps2|psc1|psc2|scf|lnk|inf|reg)$/)) {
            return cb(new Error('Dangerous files are not allowed!'), false);
        }
        cb(null, true);
    };

    private imageFilter = function (req, file, cb) {
        // accept image only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };

    private videoFilter = function (req, file, cb) {
        // accept image only
        if (!file.originalname.match(/\.(avi|flv|wmv|mov|mp4)$/)) {
            return cb(new Error('Only video files are allowed!'), false);
        }
        cb(null, true);
    };

    private docFilter = function (req, file, cb) {
        // accept image only
        if (!file.originalname.match(/\.(doc|docx|xls|xlsx)$/)) {
            return cb(new Error('Only doc files are allowed!'), false);
        }
        cb(null, true);
    };
}