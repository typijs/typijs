import { DocumentNotFoundException } from '../../error';
import { isNil, slugify } from '../../utils';
import { IContentDocument, IContentLanguageDocument, IContentModel } from "../content/content.model";
import { VersionStatus } from "../content/version-status";
import { ObjectId, PaginateOptions, QueryResult, QuerySort } from '../shared/base.model';
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
        const folderLang = {
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

        return this.mergeToContentLanguage(savedFolder, folderLang as any);
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
        return this.mergeToContentLanguage(savedFolder, savedFolder.contentLanguages[0] as any);
    }

    public getFolderChildren = async (parentId: string, project?: { [key: string]: any }): Promise<Array<T & P>> => {
        if (parentId == '0') parentId = null;

        const filter = {
            parentId: parentId ? ObjectId(parentId) : null,
            contentType: null,
            isDeleted: false,
            language: this.EMPTY_LANGUAGE
        };
        if (isNil(project)) {
            project = {
                _id: 1,
                parentId: 1,
                contentType: 1,
                language: 1,
                name: 1,
                hasChildren: 1,
                peerOrder: 1,
                childOrderRule: 1
            }
        }

        const queryResult = await this.queryContent(filter, project);
        return queryResult.docs;
    }

    protected abstract mergeToContentLanguage(content: T, contentLang: P): T & P;

    /**
     * Query content using aggregation function
     * @param filter {FilterQuery<T & P>} The filter to query content
     * @param project {string | { [key: string]: any }} (Optional) project aggregation for example: { name: 1, language: 1} or `'name,language'`
     * @param {QuerySort} [sort] - Sort option in the format: `'a,b, -c'` or `{a:1, b: 'asc', c: -1}`
     * @param {number} [page] - Current page (default = 1)
     * @param {number} [limit] - Maximum number of results per page (default = 10)
     * @returns {Object} Return `PaginateResult` object
     */
    abstract queryContent(filter: any, project?: { [key: string]: any }, sort?: string | QuerySort, page?: number, limit?: number): Promise<QueryResult<T & P>>;

    protected abstract createContent(newContent: T, parentContent: T, userId: string): Promise<T>;

    protected abstract updateHasChildren(content: T): Promise<boolean>;
}