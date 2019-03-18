import * as Bluebird from 'bluebird';
import * as mime from 'mime-types';
import * as path from 'path';
import * as fs from 'fs';

import { Media, IMediaModel } from './media.model';
import { resizeImage } from './resize-image';
import * as upload from './upload';
import { ContentCtrl } from '../content';
import { NotFoundException } from '../../errorHandling';

const fsAsync: any = Bluebird.promisifyAll(fs);

fsAsync.existsAsync = Bluebird.promisify(
    function exists2(path, exists2callback) {
        fs.exists(path, function callbackWrapper(exists) { exists2callback(null, exists); });
    });

export class MediaCtrl extends ContentCtrl {
    model = Media;

    getMediasByFolder = (req, res, next) => {
        let parentId = req.params.parentId != '0' ? req.params.parentId : null;
        this.model.find({ parentId: parentId, mimeType: { $ne: null } })
            .then(items => {
                res.status(200).json(items);
            })
            .catch(err => {
                next(err);
            })
    }

    getMediaById = (req, res, next) => {

        const widthStr = req.query.w ? req.query.w : req.query.width;
        const heightStr = req.query.h ? req.query.h : req.query.height;
        const width = widthStr ? parseInt(widthStr, 10) : undefined;
        const height = heightStr ? parseInt(heightStr, 10) : undefined;

        const fileId = req.params.fileId;
        const fileName = req.params.fileName;
        const fileExt = path.extname(fileName);

        const fileOriginalPath = path.join(upload.UPLOAD_PATH, fileId, `${fileId}${fileExt}`);

        if (width || height) {
            const fileResizedPath = path.join(upload.UPLOAD_PATH, fileId, `${fileId}_${width}x${height}${fileExt}`);
            return fsAsync.existsAsync(fileResizedPath)
                .then(exist => {
                    if (exist) return fs.createReadStream(fileResizedPath);

                    //resize image
                    return fsAsync.existsAsync(fileOriginalPath)
                        .then(existFile => existFile ?
                            resizeImage(fileOriginalPath, fileResizedPath, { width: width, height: height }).then(() => fs.createReadStream(fileResizedPath)) : null)
                })
                .then(stream => {
                    if (stream) {
                        res.writeHead(200, { 'Content-type': mime.lookup(fileName) });
                        stream.pipe(res);
                    } else {
                        res.status(404).json("404 - File Not Found");
                    }
                })
                .catch(err => {
                    next(err);
                })
        } else {
            return fsAsync.existsAsync(fileOriginalPath)
                .then(exist => {
                    if (exist) {
                        res.writeHead(200, { 'Content-type': mime.lookup(fileName) });
                        fs.createReadStream(fileOriginalPath).pipe(res);
                    } else {
                        res.status(404).json("404 - File Not Found");
                    }
                })
                .catch(err => {
                    next(err);
                })
        }
    }

    uploadMedia = (fieldName: string): any => {
        if (!fieldName) fieldName = 'file';
        return upload.uploadFile.single(fieldName);
    }

    processMedia = (req, res, next) => {
        const file = req.file;
        const mediaObj = {
            _id: req.fileId,
            name: req.fileOriginalName,
            parentId: req.params.parentId,
            mimeType: file.mimetype,
            size: file.size
        }
        this.saveMedia(mediaObj)
            .then(mediaItem => res.status(200).json(mediaItem))
            .catch(err => next(err));
    }

    private saveMedia = (media: any): Promise<IMediaModel> => {
        const mediaObj = new this.model(media);
        return this.model.findOne({ _id: mediaObj.parentId ? mediaObj.parentId : null }).exec()
            .then((parentFolder: IMediaModel) => {
                let parentId = parentFolder ? parentFolder._id : null;
                mediaObj.parentId = parentId;
                mediaObj.isContentDeleted = false;

                //create linkUrl and parent path ids
                if (parentFolder) {
                    mediaObj.parentPath = parentFolder.parentPath ? `${parentFolder.parentPath}${parentFolder._id},` : `,${parentFolder._id},`;
                } else {
                    mediaObj.parentPath = null;
                }
                return mediaObj.save();
            });
    }
}