import { BaseService } from '../shared';
import {
    IContentVersionDocument,
    VersionStatus
} from './content.model';

export class ContentVersionService<V extends IContentVersionDocument> extends BaseService<V> {
    createNewVersion = (version: V, contentId: string, userId: string, language: string, masterVersionId?: string): Promise<V> => {
        const contentVersionDoc = { ...version };
        contentVersionDoc._id = undefined;
        contentVersionDoc.contentId = contentId;
        contentVersionDoc.language = language;
        contentVersionDoc.createdBy = userId;
        contentVersionDoc.isPrimary = false;
        contentVersionDoc.masterVersionId = masterVersionId;
        contentVersionDoc.status = VersionStatus.CheckedOut;
        return this.create(contentVersionDoc)
    }

    setPrimaryVersion = async (contentId: string, versionId: string, language: string): Promise<V> => {
        // Step 1: Get old primary versions by language
        const oldPrimaryVersions = await this.find({ contentId, language, isPrimary: true } as any, { lean: true }).exec();
        const versionIds = oldPrimaryVersions.map(x => x._id.toString());
        // Step2: update all old primary versions to false
        await this.updateMany(
            { _id: { $in: versionIds } } as any,
            { isPrimary: false } as any).exec();

        // Step3: set primary for version
        return this.updateById(versionId, { isPrimary: true } as any);
    }

    //get draft version which marked as Primary
    getPrimaryDraftVersion = async (contentId: string, language: string): Promise<V> => {
        return await this.findOne({ contentId, language, isPrimary: true, $or: [{ status: VersionStatus.CheckedOut }, { status: VersionStatus.Rejected }] } as any).exec();
    }

    isDraftVersion = (status: number): boolean => {
        return status == VersionStatus.CheckedOut || status == VersionStatus.Rejected
    }
}