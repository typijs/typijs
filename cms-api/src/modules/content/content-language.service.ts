import { Validator } from '../../validation';
import { BaseService } from '../shared';
import {
    IContentDocument,
    IContentLanguageDocument
} from './content.model';
import { VersionStatus } from "./version-status";

export class ContentLanguageService<P extends IContentLanguageDocument> extends BaseService<P> {
    public async createContentLanguage(content: P, contentId: string, versionId: string, userId: string, language: string): Promise<P> {
        Validator.throwIfNull('content body', content);
        Validator.throwIfNullOrEmpty('contentId', contentId);
        Validator.throwIfNullOrEmpty('language', language);
        Validator.throwIfNullOrEmpty('userId', userId);

        const contentLangDoc = { ...content };
        contentLangDoc._id = undefined;
        contentLangDoc.contentId = contentId;
        contentLangDoc.versionId = versionId;
        contentLangDoc.language = language;
        contentLangDoc.createdBy = userId;
        contentLangDoc.status = VersionStatus.CheckedOut;
        const savedResult = await (await this.create(contentLangDoc)).populate('contentId').execPopulate();

        //update content languages array in main content
        const currentContent = savedResult.contentId as IContentDocument;
        if (!Array.isArray(currentContent.contentLanguages)) {
            currentContent.contentLanguages = [];
        }
        currentContent.contentLanguages.push(savedResult._id);
        await currentContent.save();
        return savedResult;
    }
}