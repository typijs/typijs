import { DocumentNotFoundException } from '../../error';
import { slugify } from '../../utils';
import { IContentDocument, IContentLanguageDocument, IContentModel } from "../content/content.model";
import { VersionStatus } from "../content/version-status";
import { BaseService } from '../shared/base.service';

export abstract class FolderService<T extends IContentDocument, P extends IContentLanguageDocument> extends BaseService<T>{

    protected readonly EMPTY_LANGUAGE: string = '0';

    constructor(folderModel: IContentModel<T>) {
        super(folderModel);
    }

    /**
     * Create block or media folder
     */
    public createContentFolder = async (contentFolder: T & P, userId: string): Promise<T & P> => {
        //Step1: Create content folder
        Object.assign(contentFolder, {
            contentType: null,
            masterLanguageId: this.EMPTY_LANGUAGE,
            contentLanguages: [],
            createdBy: userId
        });

        //Step2: Create folder in default language
        const folderLang: unknown = {
            name: contentFolder.name,
            //for media folder
            urlSegment: slugify(contentFolder.name),
            //for media folder
            linkUrl: slugify(contentFolder.name),
            language: this.EMPTY_LANGUAGE,
            status: VersionStatus.Published,
            startPublish: new Date(),
            createdBy: userId
        };

        //Step3: Update content language array
        contentFolder.contentLanguages.push(folderLang);

        const parentFolder = await this.findById(contentFolder.parentId).exec();
        const savedFolder = await this.createContent(contentFolder, parentFolder, userId);
        if (savedFolder) await this.updateHasChildren(parentFolder);

        return this.mergeToContentLanguage(savedFolder, folderLang);
    }

    /**
     * Update folder name of block or media folder
     */
    public updateFolderName = async (id: string, name: string, userId: string): Promise<T & P> => {
        const currentFolder = await this.findOne({ _id: id, contentLanguages: { $type: 'array', $ne: [] } } as any).exec();
        if (!currentFolder) throw new DocumentNotFoundException(id);

        const currentLang = currentFolder.contentLanguages[0];
        currentLang.name = name;
        currentLang.updatedBy = userId;

        const savedFolder = await currentFolder.save();
        return this.mergeToContentLanguage(savedFolder, savedFolder.contentLanguages[0]);
    }

    public getFolderChildren = async (parentId: string): Promise<Array<T & P>> => {
        if (parentId == '0') parentId = null;

        const folderChildren = await this.find({
            parentId: parentId,
            isDeleted: false,
            contentType: null,
            'contentLanguages.language': this.EMPTY_LANGUAGE
        } as any, { lean: true }).exec();

        return folderChildren.map(x => {
            const contentLanguage = x.contentLanguages.find(contentLang => contentLang.language === this.EMPTY_LANGUAGE);
            return this.mergeToContentLanguage(x, contentLanguage);
        })
    }

    protected mergeToContentLanguage(content: T, contentLang: Partial<IContentLanguageDocument>): T & P {
        const contentJson: any = content && typeof content.toJSON === 'function' ? content.toJSON() : content;
        const contentLangJson: any = contentLang && typeof contentLang.toJSON === 'function' ? contentLang.toJSON() : contentLang;

        if (contentLangJson && contentLangJson.childItems) {
            const language = contentLangJson.language;
            contentLangJson.childItems.forEach(childItem => {
                const publishedItem = childItem.content?.contentLanguages?.find((cLang: P) => cLang.language === language && cLang.status == VersionStatus.Published) as P;
                childItem.content = this.mergeToContentLanguage(childItem.content, publishedItem);
            });
        }

        const contentLanguageData: T & P = Object.assign(contentLangJson ?? {} as any, contentJson);

        delete contentLanguageData.contentLanguages;
        return contentLanguageData;
    }

    protected abstract createContent(newContent: T, parentContent: T, userId: string): Promise<T>;

    protected abstract updateHasChildren(content: T): Promise<boolean>;
}