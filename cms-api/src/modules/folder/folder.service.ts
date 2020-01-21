import * as mongoose from 'mongoose';

import { ContentService } from "../content/content.service";
import { IContentDocument, IFolderDocument } from "../content/content.model";
import { BaseService } from '../shared/base.service';

export class FolderService<T extends IContentDocument> extends BaseService<T>{

    private contentService: ContentService<T, null, null>;
    private folderModel: mongoose.Model<T>;

    constructor(folderModel: mongoose.Model<T>) {
        super(folderModel);
        this.folderModel = folderModel;
        this.contentService = new ContentService(folderModel, null, null);
    }

    public createContentFolder = (contentFolder: T): Promise<IFolderDocument> => {
        contentFolder.contentType = null;
        contentFolder.properties = null;
        return this.getModelById(contentFolder.parentId)
            .then((parentFolder: T) => Promise.all([
                this.contentService.createContent(contentFolder, parentFolder),
                Promise.resolve(parentFolder)
            ]))
            .then(([item, parentContent]: [IContentDocument, IContentDocument]) => this.contentService.updateHasChildren(parentContent).then(() => item))
    }

    public updateFolderName = (id: string, name: string): Promise<IFolderDocument> => {
        return this.getModelById(id)
            .then((currentFolder: IContentDocument) => {
                currentFolder.changed = new Date();
                //currentPage.changedBy = userId
                currentFolder.contentType = null;
                currentFolder.properties = null;
                currentFolder.name = name;
                return currentFolder.save();
            })
    }

    public getFolderChildren = (parentId: string): Promise<IFolderDocument[]> => {
        if (parentId == '0') parentId = null;

        return this.folderModel.find({ parentId: parentId, isDeleted: false, contentType: null, mimeType: null }).exec()
    }

    public getContentsByFolder = (parentId: string): Promise<T[]> => {
        if (parentId == '0') parentId = null;

        return this.folderModel.find({ parentId: parentId, isDeleted: false, contentType: { $ne: null }, mimeType: { $ne: null } }).exec()
    }

}