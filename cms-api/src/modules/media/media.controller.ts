import * as Promise from 'bluebird';
import * as mime from 'mime-types';
import * as path from 'path';
import * as fs from 'fs';
const fsAsync: any = Promise.promisifyAll(fs);

fsAsync.existsAsync = Promise.promisify(
    function exists2(path, exists2callback) {
        fs.exists(path, function callbackWrapper(exists) { exists2callback(null, exists); });
    });

import BaseCtrl from '../../base.controller';
import Media from './media.model';
import * as upload from './upload';
import { resizeImage } from './resize-image';

export default class MediaCtrl extends BaseCtrl {
    model = Media;

    //Override insert base
    insert = (req, res) => {
        const mediaObj = new this.model(req.body);

        //get parent folder
        this.model.findOne({ _id: mediaObj.parentId ? mediaObj.parentId : null })
            .then(parentFolder => {
                let parentId = parentFolder ? parentFolder._id : null;

                mediaObj.parentId = parentId;
                mediaObj.isDeleted = false;

                //create linkUrl and parent path ids
                if (parentFolder) {
                    mediaObj.parentPath = parentFolder.parentPath ? `${parentFolder.parentPath}${parentFolder._id},` : `,${parentFolder._id},`;
                } else {
                    mediaObj.parentPath = null;
                }

                return mediaObj.save().then(item => ({ item, parentFolder }))
            })
            .then(({ item, parentFolder }) => {
                return parentFolder ? this.updateHasChildren(parentFolder).then(updatedFolder => ({ item, updatedFolder })) : { item };
            })
            .then(({ item }) => {
                res.status(200).json(item);
            })
            .catch(err => {
                return this.handleError(err);
            })
    }

    update = (req, res) => {
        const mediaObj = req.body;

        this.model.findOne({ _id: req.params.id })
            .then(matchFolder => {
                if (!matchFolder) return null;

                //update existing page
                matchFolder.changed = Date.now();
                //matchPage.changedBy = userId
                matchFolder.name = mediaObj.name;
                return matchFolder.save();
            })
            .then(item => {
                if (item) {
                    res.status(200).json(item);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(error => {
                return this.handleError(error);
            });
    }

    getFoldersByParentId = (req, res) => {
        let parentId = req.params.parentId ? req.params.parentId : null;
        this.model.find({ parentId: parentId, contentType: null })
            .then(items => {
                res.status(200).json(items);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    getMediasByFolder = (req, res) => {
        let parentId = req.params.parentId ? req.params.parentId : null;
        this.model.find({ parentId: parentId, contentType: { $ne: null } })
            .then(items => {
                res.status(200).json(items);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    getMediaById = (req, res) => {

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
                    res.status(500).json(err);
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
                    res.status(500).json(err);
                })
        }
    }

    uploadMedia = (fieldName: string): any => {
        if (!fieldName) fieldName = 'file';
        return upload.uploadFile.single(fieldName);
    }

    processMedia = (req, res) => {
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
            .catch(error => res.status(500).json(error));
    }

    private saveMedia = (media: any): any => {
        const mediaObj = new this.model(media);
        return this.model.findOne({ _id: mediaObj.parentId ? mediaObj.parentId : null })
            .then(parentFolder => {
                let parentId = parentFolder ? parentFolder._id : null;
                mediaObj.parentId = parentId;
                mediaObj.isDeleted = false;

                //create linkUrl and parent path ids
                if (parentFolder) {
                    mediaObj.parentPath = parentFolder.parentPath ? `${parentFolder.parentPath}${parentFolder._id},` : `,${parentFolder._id},`;
                } else {
                    mediaObj.parentPath = null;
                }
                return mediaObj.save();
            })
    }

    private updateHasChildren = (folder: any): any => {
        folder.hasChildren = true;
        return folder.save();
    }
}