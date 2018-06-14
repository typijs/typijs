import * as mongoose from 'mongoose';

import BaseCtrl from '../../base.controller';
import Block from './block.model';

export default class BlockCtrl extends BaseCtrl {
    model = Block;

    //Override insert base
    insert = (req, res) => {
        const blockObj = new this.model(req.body);

        //get parent folder
        this.model.findOne({
            _id: blockObj.parentId ? blockObj.parentId : null
        })
            .then(parentFolder => {
                let parentId = parentFolder ? parentFolder._id : null;

                blockObj.parentId = parentId;
                blockObj.isDeleted = false;

                //create linkUrl and parent path ids
                if (parentFolder) {
                    blockObj.parentPath = parentFolder.parentPath ? `${parentFolder.parentPath}${parentFolder._id},` : `,${parentFolder._id},`;
                } else {
                    blockObj.parentPath = null;
                }

                blockObj.save((err, item) => {
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
        const blockObj = req.body;

        this.model.findOne({ _id: req.params.id })
            .then(matchBlock => {
                if (!matchBlock) return;

                //update existing page
                matchBlock.changed = Date.now();
                //matchPage.changedBy = userId
                matchBlock.name = blockObj.name;
                matchBlock.properties = blockObj.properties;
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

    getBlocksByFolder = (req, res) => {
        let parentId = req.params.parentId != 'null' ? req.params.parentId : null;
        this.model.find({ parentId: parentId, contentType: { $ne: null } }, (err, items) => {
            if (err) { return this.handleError(err); }
            res.status(200).json(items);
        });
    }

    private updateHasChildren = (block: any): any => {
        block.hasChildren = true;
        block.save(function (err) {
            if (err) return this.handleError(err);
        });
    }
}