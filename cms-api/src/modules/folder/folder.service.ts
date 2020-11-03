import { DocumentNotFoundException } from '../../error';
import { IContentDocument, IContentLanguageDocument, IContentLanguageModel, IContentModel, VersionStatus } from "../content/content.model";
import { BaseService } from '../shared/base.service';

export abstract class FolderService<T extends IContentDocument, P extends IContentLanguageDocument> extends BaseService<T>{

    private readonly DefaultLanguageId: string = '0';
    private folderLanguageService: BaseService<P>;

    constructor(folderModel: IContentModel<T>, folderLanguageModel: IContentLanguageModel<P>) {
        super(folderModel);
        this.folderLanguageService = new BaseService<P>(folderLanguageModel);
    }

    /**
     * Create block or media folder
     */
    public createContentFolder = async (contentFolder: T & P, userId: string): Promise<T & P> => {
        //Step1: Create content folder
        contentFolder.contentType = null;
        contentFolder.properties = null;
        contentFolder.masterLanguageId = this.DefaultLanguageId;
        contentFolder.createdBy = userId;
        const parentFolder = await this.findById(contentFolder.parentId).exec();
        const savedFolder = await this.createContent(contentFolder, parentFolder, userId);
        if (savedFolder) await this.updateHasChildren(parentFolder);

        //Step2: Create folder in default language
        const folderLang = this.folderLanguageService.createModel(contentFolder);
        folderLang.contentId = savedFolder._id;
        folderLang.language = this.DefaultLanguageId;
        folderLang.status = VersionStatus.Published;
        folderLang.startPublish = new Date();
        folderLang.createdBy = userId;
        const savedFolderLang = await folderLang.save();

        //Step3: Update content language array
        savedFolder.contentLanguages = [];
        savedFolder.contentLanguages.push(savedFolderLang._id);
        await savedFolder.save();

        return this.mergeToContentLanguage(savedFolder, savedFolderLang);
    }

    /**
     * Update folder name of block or media folder
     */
    public updateFolderName = async (id: string, name: string, userId: string): Promise<P> => {
        const currentFolderLang = await this.folderLanguageService.findOne({ contentId: id } as any).exec();
        if (!currentFolderLang) throw new DocumentNotFoundException(id);

        currentFolderLang.name = name;
        currentFolderLang.updatedBy = userId;
        return this.folderLanguageService.updateById(currentFolderLang._id, currentFolderLang);
    }

    public getFolderChildren = async (parentId: string): Promise<T[]> => {
        if (parentId == '0') parentId = null;

        const folderChildren = await this.find({ parentId: parentId, isDeleted: false, contentType: null } as any, { lean: true })
            .populate({
                path: 'contentLanguages',
                match: { language: this.DefaultLanguageId }
            })
            .exec();

        return folderChildren.map(x => {
            const contentLanguage = x.contentLanguages.find(contentLang => contentLang.language === this.DefaultLanguageId);
            return this.mergeToContentLanguage(x, contentLanguage);
        })
    }

    public getContentChildren = async (parentId: string, language: string): Promise<Array<T & P>> => {
        if (parentId == '0') parentId = null;

        const contentChildren = await this.find({ parentId: parentId, isDeleted: false, contentType: { $ne: null } } as any, { lean: true })
            .populate({
                path: 'contentLanguages',
                match: { language: language }
            })
            .exec();

        return contentChildren.map(x => {
            const contentLanguage = x.contentLanguages.find(contentLang => contentLang.language === language);
            return this.mergeToContentLanguage(x, contentLanguage);
        })
    }

    protected mergeToContentLanguage(content: T, contentLang: P): T & P {
        delete contentLang._id
        const contentLanguageData: T & P = Object.assign(content, contentLang);
        delete contentLanguageData.contentLanguages;
        delete contentLanguageData.contentId;
        return contentLanguageData;
    }

    protected abstract createContent(newContent: T, parentContent: T, userId: string): Promise<T>;

    protected abstract updateHasChildren(content: T): Promise<boolean>;
}