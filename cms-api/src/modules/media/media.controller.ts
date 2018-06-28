import * as mongoose from 'mongoose';


import BaseCtrl from '../../base.controller';
import Media from './media.model';
import * as path from 'path';
import * as fs from 'fs';

export default class MediaCtrl extends BaseCtrl {
    model = Media;

    //Override insert base
    insert = (req, res) => {
        const mediaObj = new this.model(req.body);

        //get parent folder
        this.model.findOne({
            _id: mediaObj.parentId ? mediaObj.parentId : null
        })
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

                mediaObj.save((err, item) => {
                    // 11000 is the code for duplicate key error
                    if (err && err.code === 11000) {
                        res.sendStatus(400);
                    }
                    if (err) { return this.handleError(err); }

                    res.status(200).json(item);
                    //update hasChildren of parent in case successfully insert
                    if (parentFolder) this.updateHasChildren(parentFolder);
                });
            })
            .catch(err => {
                return this.handleError(err);
            })
    }

    update = (req, res) => {
        const mediaObj = req.body;

        this.model.findOne({ _id: req.params.id })
            .then(matchBlock => {
                if (!matchBlock) return;

                //update existing page
                matchBlock.changed = Date.now();
                //matchPage.changedBy = userId
                matchBlock.name = mediaObj.name;
                matchBlock.save((error, result) => {

                });

                res.sendStatus(200);
            })
            .catch(error => {
                return this.handleError(error);
            });
    }

    getFoldersByParentId = (req, res) => {
        let parentId = req.params.parentId != 'null' ? req.params.parentId : null;
        this.model.find({ parentId: parentId, contentType: null }, (err, items) => {
            if (err) { return this.handleError(err); }
            res.status(200).json(items);
        });
    }

    getMediasByFolder = (req, res) => {
        let parentId = req.params.parentId != 'null' ? req.params.parentId : null;
        this.model.find({ parentId: parentId, contentType: { $ne: null } }, (err, items) => {
            if (err) { return this.handleError(err); }
            res.status(200).json(items);
        });
    }

    uploadMedia = (req, res) => {
        const file = req.file;
        const mediaObj = {
            _id: req.fileName,
            name: req.fileOriginalName,
            parentId: req.params.parentId,
            mimeType: file.mimetype,
            size: file.size
        }
        this.saveMedia(mediaObj)
            .then(mediaItem => res.status(200).json(mediaItem))
            .catch(error => res.status(400).json(error));
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

    private updateHasChildren = (media: any): any => {
        media.hasChildren = true;
        media.save(function (err) {
            if (err) return this.handleError(err);
        });
    }
}