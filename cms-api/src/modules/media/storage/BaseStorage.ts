import { Request } from "express";
import { StorageEngine } from "multer";
export abstract class CmsStorageEngine implements StorageEngine {
    abstract _handleFile(req: Request, file: Express.Multer.File, callback: (error?: any, info?: Partial<Express.Multer.File>) => void);
    abstract _removeFile(req: Request, file: Express.Multer.File, callback: (error: Error) => void);
}