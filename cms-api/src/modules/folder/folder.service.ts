import { DocumentNotFoundException } from '../../error';
import { slugify } from '../../utils';
import { IContentDocument, IContentLanguageDocument, IContentLanguageModel, IContentModel } from "../content/content.model";
import { VersionStatus } from "../content/version-status";
import { BaseService } from '../shared/base.service';

export abstract class FolderService<T extends IContentDocument, P extends IContentLanguageDocument> extends BaseService<T>{

    protected readonly EMPTY_LANGUAGE: string = '0';
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
        Object.assign(contentFolder, {
            urlSegment: slugify(contentFolder.name),
            linkUrl: slugify(contentFolder.name),
            contentType: null,
            properties: null,
            masterLanguageId: this.EMPTY_LANGUAGE,
            createdBy: userId
        });

        const parentFolder = await this.findById(contentFolder.parentId).exec();
        const savedFolder = await this.createContent(contentFolder, parentFolder, userId);
        if (savedFolder) await this.updateHasChildren(parentFolder);

        //Step2: Create folder in default language
        const folderLang = this.folderLanguageService.createModel(contentFolder);
        folderLang.contentId = savedFolder._id;
        folderLang.language = this.EMPTY_LANGUAGE;
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

    public getFolderChildren = async (parentId: string): Promise<Array<T & P>> => {
        if (parentId == '0') parentId = null;

        const folderChildren = await this.find({ parentId: parentId, isDeleted: false, contentType: null } as any, { lean: true })
            .populate({
                path: 'contentLanguages',
                match: { language: this.EMPTY_LANGUAGE }
            })
            .exec();

        return folderChildren.map(x => {
            const contentLanguage = x.contentLanguages.find(contentLang => contentLang.language === this.EMPTY_LANGUAGE);
            return this.mergeToContentLanguage(x, contentLanguage);
        })
    }

    protected mergeToContentLanguage(content: T, contentLang: P): T & P {
        const contentJson: T = content && typeof content.toJSON === 'function' ? content.toJSON() : content;
        const contentLangJson: P = contentLang && typeof contentLang.toJSON === 'function' ? contentLang.toJSON() : contentLang;

        if (contentLangJson && contentLangJson.childItems) {
            const language = contentLangJson.language;
            contentLangJson.childItems.forEach(childItem => {
                const publishedItem = childItem.content?.contentLanguages?.find((cLang: P) => cLang.language === language && cLang.status == VersionStatus.Published) as P;
                childItem.content = this.mergeToContentLanguage(childItem.content, publishedItem);
            });
        }

        const contentLanguageData: T & P = Object.assign(contentLangJson ?? {} as any, contentJson);

        delete contentLanguageData.contentLanguages;
        delete contentLanguageData.contentId;
        return contentLanguageData;
    }

    protected abstract createContent(newContent: T, parentContent: T, userId: string): Promise<T>;

    protected abstract updateHasChildren(content: T): Promise<boolean>;
}