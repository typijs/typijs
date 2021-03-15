import { FilterQuery } from "mongoose";
import { isNil } from '../../utils';
import { pick } from "../../utils/pick";
import { ObjectId, QuerySort } from '../shared/base.model';

export class QueryHelper {
    static readonly contentFields: string[] = [
        '_id',
        'parentId',
        'parentPath',
        'ancestors',
        'hasChildren',
        'childOrderRule',
        'peerOrder',
        'visibleInMenu',

        'isDeleted',
        'deletedAt',
        'deletedBy',

        'contentType',
        'masterLanguageId',

        'createdBy',
        'createdAt',
        'updatedBy',
        'updatedAt'
    ];

    static readonly contentLanguageFields: string[] = [
        'name',
        'language',
        'versionId',

        'urlSegment',
        'properties',
        'childItems',
        'status',

        'updatedAt',
        'createdBy',
        'createdAt',
        'updatedBy',

        'startPublish',
        'stopPublish',
        'delayPublishUntil',
        'publishedBy',

        'simpleAddress',
        'linkUrl'
    ];

    static getContentProjection(project: string | { [key: string]: any }) {
        if (isNil(project)) return { _v: 0 };

        const projectObj = typeof project === 'string' ? this.parseUnaries(project) : project;

        let contentProject = pick(projectObj, this.contentFields);
        const resultProject = this.removeUndefinedProperties(contentProject);

        let contentLangProject = pick(projectObj, this.contentLanguageFields);
        contentLangProject = this.removeUndefinedProperties(contentLangProject);
        Object.keys(contentLangProject).forEach(key => {
            resultProject[`contentLanguages.${key}`] = contentLangProject[key];
        })
        return Object.keys(resultProject).length > 0 ? resultProject : { _v: 0 }
    }

    /**
     * Map/reduce helper to transform list of unaries
     * like '+a,-b,c' to {a: 1, b: -1, c: 1}
     * 
     * Credit: https://github.com/loris/api-query-params/blob/master/src/index.js#L105
     */
    static parseUnaries(unaries, values = { plus: 1, minus: -1 }): { [key: string]: number } {
        const unariesAsArray =
            typeof unaries === 'string' ? unaries.split(',') : unaries;

        return unariesAsArray
            .map((unary) => unary.match(/^(\+|-)?(.*)/))
            .reduce((result, [, val, key]) => {
                result[key.trim()] = val === '-' ? values.minus : values.plus;
                return result;
            }, {});
    };

    static getContentFilter(filter): FilterQuery<any> {
        // IContent filter
        let contentFilter = pick(filter, this.contentFields);
        contentFilter = this.removeUndefinedProperties(contentFilter);
        contentFilter = this.convertToMongoDbFilter(contentFilter, ['_id', 'parentId', 'createdBy', 'updatedBy', 'deletedBy']);

        let contentLangFilter = pick(filter, this.contentLanguageFields);
        contentLangFilter = this.removeUndefinedProperties(contentLangFilter);
        contentLangFilter = this.convertToMongoDbFilter(contentLangFilter, ['versionId', 'createdBy', 'updatedBy', 'publishedBy', 'deletedBy']);
        if (Object.keys(contentLangFilter).length > 0)
            Object.assign(contentFilter, { contentLanguages: { $elemMatch: contentLangFilter } });

        return contentFilter;
    }

    static getContentLanguageFilter(filter): FilterQuery<any> {
        let contentLanguageFilter = pick(filter, this.contentLanguageFields);

        contentLanguageFilter = this.removeUndefinedProperties(contentLanguageFilter);
        const resultFilter = {};
        Object.keys(contentLanguageFilter).forEach(key => {
            if (key === 'properties') {
                Object.keys(contentLanguageFilter['properties']).forEach(field => {
                    resultFilter[`contentLanguages.properties.${field}`] = contentLanguageFilter['properties'][field];
                })
            } else {
                resultFilter[`contentLanguages.${key}`] = contentLanguageFilter[key];
            }

        })
        return this.convertToMongoDbFilter(resultFilter);
    }

    static getCombineContentSort(sort: string | QuerySort): QuerySort {
        if (isNil(sort)) return { createdAt: -1 };

        const sortObj = typeof sort === 'string' ? this.parseUnaries(sort) : sort;

        const contentSort = this.getContentSort(sortObj as any);
        const languageSort = this.getContentLanguageSort(sortObj as any);
        const combinedSort = { ...contentSort, ...languageSort };
        const isHasCreatedAtSort = Object.keys(combinedSort).some(key => key === 'createdAt');
        if (!isHasCreatedAtSort) {
            combinedSort['createdAt'] = -1;
        }
        return combinedSort;
    }

    static deepPopulate(level: number, language: string, statuses?: number[]): { path: string, match?: any, select?: any, populate?: any } {
        const populatePath = 'contentLanguages.childItems.content';
        const contentLangFilter = statuses ? { language, status: { $in: statuses } } : { language };
        const populateMatch = { isDeleted: false, contentLanguages: { $elemMatch: contentLangFilter } };
        const populateSelect = { _id: 1, contentType: 1, parentId: 1, parentPath: 1, contentLanguages: { $elemMatch: contentLangFilter } }
        if (level > 1) {
            return {
                path: populatePath,
                match: populateMatch,
                select: populateSelect,
                populate: this.deepPopulate(--level, language, statuses),
            }
        } else if (level == 1) {
            return {
                path: populatePath,
                match: populateMatch,
                select: populateSelect
            }
        }
        return null;
    }

    private static getContentSort(sort: QuerySort): QuerySort {
        const contentSort = pick(sort, this.contentFields);
        return this.removeUndefinedProperties(contentSort);
    }

    private static getContentLanguageSort(sort: QuerySort): QuerySort {
        let contentLanguageSort = pick(sort, this.contentLanguageFields);
        contentLanguageSort = this.removeUndefinedProperties(contentLanguageSort);
        const resultSort = {};
        Object.keys(contentLanguageSort).forEach(key => {
            if (key === 'properties') {
                Object.keys(contentLanguageSort['properties']).forEach(field => {
                    resultSort[`contentLanguages.properties.${field}`] = contentLanguageSort['properties'][field];
                })
            } else {
                resultSort[`contentLanguages.${key}`] = contentLanguageSort[key];
            }

        })
        return resultSort;
    }

    private static convertToMongoDbFilter(contentFilter, mongoObjectIdFields: string[] = []): any {
        Object.keys(contentFilter).forEach(key => {
            // convert string to ObjectId
            if (mongoObjectIdFields.indexOf(key) !== -1) {
                if (typeof contentFilter[key] === 'string') {
                    contentFilter[key] = ObjectId(contentFilter[key]);
                } else if (!isNil(contentFilter[key])) {
                    Object.keys(contentFilter[key]).forEach(field => {
                        switch (field) {
                            case '$in':
                                const ids = contentFilter[key]['$in'];
                                contentFilter[key]['$in'] = Array.from(ids).map((id: string) => ObjectId(id));
                                break;
                            case '$ne':
                            case '$eq':
                                const id = contentFilter[key][field];
                                contentFilter[key][field] = ObjectId(id);
                                break;
                        }
                    })

                }
            }
        })

        return contentFilter;
    }

    private static removeUndefinedProperties(obj) {
        //remove the undefined property
        Object.keys(obj).forEach(key => {
            if (obj[key] === undefined) {
                delete obj[key];
            }
        })
        return obj;
    }
}