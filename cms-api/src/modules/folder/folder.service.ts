import * as mongoose from 'mongoose';

import { IContentDocument, IFolderDocument } from "../content/content.model";
import { ContentService } from "../content/content.service";
import { BaseService } from '../shared/base.service';

export class FolderService<T extends IContentDocument> extends BaseService<T>{

    private contentService: ContentService<T, null, null>;
    private folderModel: mongoose.Model<T>;

    constructor(folderModel: mongoose.Model<T>) {
        super(folderModel);
        this.folderModel = folderModel;
        this.contentService = new ContentService(folderModel, null, null);
    }

    public createContentFolder = async (contentFolder: T): Promise<IFolderDocument> => {
        contentFolder.contentType = null;
        contentFolder.properties = null;
        const parentFolder = await this.getDocumentById(contentFolder.parentId);
        const savedContent = await this.contentService.createContent(contentFolder, parentFolder);
        if (savedContent) await this.contentService.updateHasChildren(parentFolder);

        return savedContent;
    }

    public updateFolderName = async (id: string, name: string): Promise<IFolderDocument> => {
        const currentFolder = await this.getDocumentById(id);
        if (currentFolder) {
            currentFolder.changed = new Date();
            //TODO: currentPage.changedBy = userId
            currentFolder.contentType = null;
            currentFolder.properties = null;
            currentFolder.name = name;
            return currentFolder.save();
        }

        return null;
    }

    public getFolderChildren = (parentId: string): Promise<IFolderDocument[]> => {
        if (parentId == '0') parentId = null;

        return this.folderModel.find({ parentId: parentId, isDeleted: false, contentType: null, mimeType: null }).lean().exec()
    }

    public getContentsByFolder = (parentId: string): Promise<T[]> => {
        if (parentId == '0') parentId = null;

        return this.folderModel.find({ parentId: parentId, isDeleted: false, contentType: { $ne: null } }).lean().exec()
    }

}