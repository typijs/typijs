import { DocumentNotFoundException } from '../../error';
import { IContentDocument, IContentLanguageDocument, IContentLanguageModel, IContentModel, VersionStatus } from "../content/content.model";
import { BaseService } from '../shared/base.service';

export abstract class FolderService<T extends IContentDocument, P extends IContentLanguageDocument> extends BaseService<T>{

    private folderLanguageService: BaseService<P>;

    constructor(folderModel: IContentModel<T>, folderLanguageModel: IContentLanguageModel<P>) {
        super(folderModel);
        this.folderLanguageService = new BaseService<P>(folderLanguageModel);
    }

    /**
     * Create block or media folder
     */
    public createContentFolder = async (contentFolder: T & P, userId: string): Promise<IContentDocument & IContentLanguageDocument> => {
        //Step1: Create content folder
        contentFolder.contentType = null;
        contentFolder.properties = null;
        contentFolder.masterLanguageId = '0';
        contentFolder.createdBy = userId;
        const parentFolder = await this.findById(contentFolder.parentId).exec();
        const savedFolder = await this.createContent(contentFolder, parentFolder, userId);
        if (savedFolder) await this.updateHasChildren(parentFolder);

        //Step2: Create folder in default language
        const folderLang = this.folderLanguageService.createModel(contentFolder);
        folderLang.contentId = savedFolder._id;
        folderLang.languageId = '0';
        folderLang.status = VersionStatus.Published;
        folderLang.startPublish = new Date();
        folderLang.createdBy = userId;
        const savedFolderLang = await folderLang.save();

        //Step3: Update content language array
        savedFolder.contentLanguages = [];
        savedFolder.contentLanguages.push(savedFolderLang._id);
        await savedFolder.save();

        return Object.assign(savedFolder, savedFolderLang);
    }

    /**
     * Update folder name of block or media folder
     */
    public updateFolderName = async (id: string, name: string, userId: string): Promise<IContentLanguageDocument> => {
        const currentFolderLang = await this.folderLanguageService.findOne({ contentId: id } as any).exec();
        if (!currentFolderLang) throw new DocumentNotFoundException(id);

        //TODO: currentFolderLang.changedBy = userId
        currentFolderLang.name = name;
        currentFolderLang.updatedBy = userId;
        return currentFolderLang.save();
    }

    public getFolderChildren = async (parentId: string): Promise<T[]> => {
        if (parentId == '0') parentId = null;

        const folderChildren = await this.find({ parentId: parentId, isDeleted: false, contentType: null } as any, { lean: true })
            .populate({
                path: 'contentLanguages',
                match: { languageId: '0' }
            })
            .exec();

        return folderChildren.map(x => Object.assign(x, x.contentLanguages.find(lang => lang === '0')));
    }

    public getContentChildren = async (parentId: string, languageId: string): Promise<T[]> => {
        if (parentId == '0') parentId = null;

        const contentChildren = await this.find({ parentId: parentId, isDeleted: false, contentType: { $ne: null } } as any, { lean: true })
            .populate({
                path: 'contentLanguages',
                match: { languageId: languageId }
            })
            .exec();
        return contentChildren.map(x => Object.assign(x, x.contentLanguages.find(lang => lang === languageId)));
    }

    protected abstract createContent(newContent: T, parentContent: T, userId: string): Promise<T>

    protected abstract updateHasChildren(content: IContentDocument): Promise<boolean>
}