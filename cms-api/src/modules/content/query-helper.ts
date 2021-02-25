import * as mongoose from 'mongoose';
import { FilterQuery } from "mongoose";
import { isNil } from '../../utils';
import { pick } from "../../utils/pick";
import { QuerySort } from '../shared/base.model';
const ObjectId = mongoose.Types.ObjectId;

export class QueryHelper {
    static getContentProjection(project) {

        let contentProject = pick(project, [
            'ancestors',
            'hasChildren',
            'childOrderRule',
            'peerOrder',
            'isDeleted',
            'visibleInMenu',
            'contentType',
            'masterLanguageId',
            'createdBy',
            'createdAt',
            'updatedBy',
            'updatedAt',
            'parentId',
            'parentPath']);
        const resultProject = this.removeUndefinedProperties(contentProject);

        let contentLangProject = pick(project, [
            'name',
            'urlSegment',
            'language',
            'status',
            'startPublish',
            'updatedAt',
            'createdBy',
            'versionId',
            'childItems',
            'createdAt',
            'updatedBy',
            'publishedBy',
            'properties',
            'simpleAddress',
            'linkUrl']);
        contentLangProject = this.removeUndefinedProperties(contentLangProject);
        Object.keys(contentLangProject).forEach(key => {
            resultProject[`contentLanguages.${key}`] = contentLangProject[key];
        })
        return Object.keys(resultProject).length > 0 ? resultProject : { _v: 0 }
    }

    static getContentFilter(filter): FilterQuery<any> {
        // IContent filter
        let contentFilter = pick(filter, ['_id', 'hasChildren', 'parentId', 'parentPath', 'contentType', 'createdBy', 'isDeleted', 'deletedBy']);
        contentFilter = this.removeUndefinedProperties(contentFilter);
        contentFilter = this.convertToMongoDbFilter(contentFilter, ['_id', 'parentId', 'createdBy', 'deletedBy']);

        let contentLangFilter = pick(filter, ['name', 'urlSegment', 'language', 'status', 'startPublish', 'updatedAt']);
        contentLangFilter = this.removeUndefinedProperties(contentLangFilter);
        contentLangFilter = this.convertToMongoDbFilter(contentLangFilter);
        if (Object.keys(contentLangFilter).length > 0)
            Object.assign(contentFilter, { contentLanguages: { $elemMatch: contentLangFilter } });

        return contentFilter;
    }

    static getContentLanguageFilter(filter): FilterQuery<any> {
        let contentFilter = pick(filter, ['name', 'urlSegment', 'language', 'status', 'startPublish', 'updatedAt', 'properties']);

        contentFilter = this.removeUndefinedProperties(contentFilter);
        const contentLanguageFilter = {};
        Object.keys(contentFilter).forEach(key => {
            if (key === 'properties') {
                Object.keys(contentFilter['properties']).forEach(field => {
                    contentLanguageFilter[`contentLanguages.properties.${field}`] = contentFilter['properties'][field];
                })
            } else {
                contentLanguageFilter[`contentLanguages.${key}`] = contentFilter[key];
            }

        })
        return this.convertToMongoDbFilter(contentLanguageFilter);
    }

    static getCombineContentSort(sort: QuerySort): QuerySort {
        const contentSort = this.getContentSort(sort);
        const languageSort = this.getContentLanguageSort(sort);
        const combinedSort = { ...contentSort, ...languageSort };
        const isHasCreatedAtSort = Object.keys(combinedSort).some(key => key === 'createdAt');
        if (!isHasCreatedAtSort) {
            combinedSort['createdAt'] = -1;
        }
        return combinedSort;
    }

    private static getContentSort(sort: QuerySort): QuerySort {
        const contentSort = pick(sort, ['parentId', 'parentPath', 'contentType', 'createdAt', 'updatedAt', 'deletedBy']);
        return this.removeUndefinedProperties(contentSort);
    }

    private static getContentLanguageSort(sort: QuerySort): QuerySort {
        let contentSort = pick(sort, ['name', 'urlSegment', 'language', 'status', 'startPublish', 'updatedAt', 'properties']);
        contentSort = this.removeUndefinedProperties(contentSort);
        const contentLanguageSort = {};
        Object.keys(contentSort).forEach(key => {
            if (key === 'properties') {
                Object.keys(contentSort['properties']).forEach(field => {
                    contentLanguageSort[`contentLanguages.properties.${field}`] = contentSort['properties'][field];
                })
            } else {
                contentLanguageSort[`contentLanguages.${key}`] = contentSort[key];
            }

        })
        return contentLanguageSort;
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