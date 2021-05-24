import { Validator } from '../../validation/validator';
import { BaseService } from '../shared';
import { IContentVersionDocument } from './content.model';
import { VersionStatus } from "./version-status";

export class ContentVersionService<V extends IContentVersionDocument> extends BaseService<V> {

    /**
     * Create new version of content
     * @param version 
     * @param contentId 
     * @param userId 
     * @param language 
     * @param masterVersionId 
     */
    createNewVersion = (version: V, contentId: string, userId: string, language: string, masterVersionId?: string): Promise<V> => {
        Validator.throwIfNull('version body', version);
        Validator.throwIfNullOrEmpty('contentId', contentId);
        Validator.throwIfNullOrEmpty('language', language);
        Validator.throwIfNullOrEmpty('userId', userId);

        const contentVersionDoc = { ...version };
        contentVersionDoc._id = undefined;
        contentVersionDoc.contentId = contentId;
        contentVersionDoc.language = language;
        contentVersionDoc.createdBy = userId;
        contentVersionDoc.savedAt = new Date();
        contentVersionDoc.savedBy = userId;
        contentVersionDoc.isPrimary = false;
        contentVersionDoc.masterVersionId = masterVersionId;
        contentVersionDoc.status = VersionStatus.CheckedOut;
        return this.create(contentVersionDoc)
    }

    /**
     * Set the specific version as primary version. Each language will have one the primary version
     * @param versionId 
     */
    setPrimaryVersion = async (versionId: string): Promise<V> => {
        Validator.throwIfNullOrEmpty('versionId', versionId);

        const matchVersion = await this.findById(versionId).exec();
        Validator.throwIfNotFound('Content Version', matchVersion, { versionId });

        const { contentId, language } = matchVersion;

        // Step 1: Get old primary versions by language
        const oldPrimaryVersions = await this.find({ contentId, language, isPrimary: true } as any, { lean: true }).exec();
        const versionIds = oldPrimaryVersions.map(x => x._id.toString());
        // Step2: update all old primary versions to false
        await this.updateMany(
            { _id: { $in: versionIds } } as any,
            { isPrimary: false } as any).exec();

        // Step3: set primary for version
        matchVersion.isPrimary = true;
        return await matchVersion.save();
    }

    /**
     * Get content version without deep populate by version id
     * @param versionId 
     */
    getVersionById = async (versionId: string): Promise<V> => {
        Validator.throwIfNullOrEmpty('versionId', versionId);

        //Step1: Get current version
        const currentVersion = await this.findOne({ _id: versionId } as any)
            .populate({
                path: 'contentId',
                match: { isDeleted: false }
            }).exec();

        Validator.throwIfNotFound('ContentVersion', currentVersion, { _id: versionId });
        Validator.throwIfNullOrEmpty('Language of content', currentVersion.language);
        Validator.throwIfNotFound('Content', currentVersion.contentId, { contentId: currentVersion.contentId });

        return currentVersion;
    }

    /**
     * Get draft version (`CheckedOut` or `Rejected`) which marked as primary
     * @param contentId 
     * @param language 
     */
    getPrimaryDraftVersion = async (contentId: string, language: string): Promise<V> => {
        Validator.throwIfNullOrEmpty('contentId', contentId);
        Validator.throwIfNullOrEmpty('language', language);

        return await this.findOne({ contentId, language, isPrimary: true, $or: [{ status: VersionStatus.CheckedOut }, { status: VersionStatus.Rejected }] } as any).exec();
    }

    /**
     * Get all version of content. The result is sorted by saved date desc
     * @param contentId 
     */
    getAllVersionsOfContent = (contentId: string): Promise<V[]> => {
        Validator.throwIfNullOrEmpty('contentId', contentId);

        return this.find({ contentId } as any, { lean: true })
            .sort('-savedAt')
            .populate('savedBy').exec()
    }
}