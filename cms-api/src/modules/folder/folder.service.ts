import { IContentDocument, IFolderDocument, IContentModel } from "../content/content.model";
import { BaseService } from '../shared/base.service';
import { DocumentNotFoundException } from '../../errorHandling';

export abstract class FolderService<T extends IContentDocument> extends BaseService<T>{

    private folderModel: IContentModel<T>;

    constructor(folderModel: IContentModel<T>) {
        super(folderModel);
        this.folderModel = folderModel;
    }

    public createContentFolder = async (contentFolder: T): Promise<IFolderDocument> => {
        contentFolder.contentType = null;
        contentFolder.properties = null;
        const parentFolder = await this.getById(contentFolder.parentId);
        const savedContent = await this.createContent(contentFolder, parentFolder);
        if (savedContent) await this.updateHasChildren(parentFolder);

        return savedContent;
    }

    public updateFolderName = async (id: string, name: string): Promise<IFolderDocument> => {
        const currentFolder = await this.getById(id);
        if (!currentFolder) throw new DocumentNotFoundException(id);

        currentFolder.updatedAt = new Date();
        //TODO: currentPage.changedBy = userId
        currentFolder.contentType = null;
        currentFolder.properties = null;
        currentFolder.name = name;
        return currentFolder.save();
    }

    public getFolderChildren = (parentId: string): Promise<IFolderDocument[]> => {
        if (parentId == '0') parentId = null;

        return this.folderModel.find({ parentId: parentId, isDeleted: false, contentType: null, mimeType: null }).lean().exec()
    }

    public getContentsByFolder = (parentId: string): Promise<T[]> => {
        if (parentId == '0') parentId = null;

        return this.folderModel.find({ parentId: parentId, isDeleted: false, contentType: { $ne: null } }).lean().exec()
    }

    public abstract createContent(newContent: T, parentContent: T): Promise<T>

    public abstract updateHasChildren(content: IContentDocument): Promise<boolean>
}