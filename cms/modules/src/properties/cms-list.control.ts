import { generateUUID } from '@angular-cms/core';
import { CmsControl } from './cms-control';

export type ListItem = {
    /**
     * Each item in list control must have the unique guid to insert, update correctly in view
     */
    guid?: string;
    [key: string]: any;
};

export abstract class CmsListControl extends CmsControl {
    get model(): ListItem[] {
        return this._model;
    }
    private _model: ListItem[];

    writeValue(value: ListItem[]): void {
        this._model = this.generateGUID(value);
    }

    itemSorted(items: ListItem[]) {
        this._model = items;
        this.onChange(this._model);
    }

    insertOrUpdateItem(item: ListItem) {
        if (!this._model) { this._model = []; }
        const existIndex = this._model.findIndex(x => x.guid === item.guid);
        if (existIndex === -1) {
            // Insert new item
            item.guid = generateUUID();
            this._model.push(item);
        } else {
            Object.assign(this._model[existIndex], item);
        }

        this.onChange(this._model);
    }

    removeItem(itemGuid: string) {
        if (this.removeItemFromModel(itemGuid)) {
            this.onChange(this._model);
        }
    }

    private removeItemFromModel(itemGuid: string): boolean {
        const existIndex = this._model.findIndex(x => x.guid === itemGuid);
        if (existIndex === -1) { return false; }

        this._model.splice(existIndex, 1);
        return true;
    }

    /**
     * Generates guid for each item
     * @param items
     * @returns guid
     */
    private generateGUID(items: ListItem[]): ListItem[] {
        items?.forEach(item => {
            if (item.guid == null || item.guid == undefined || item.guid === '') { item.guid = generateUUID(); }
        });
        return items;
    }
}
