import { generateUUID } from "@angular-cms/core";
import { Input } from "@angular/core";
import { CmsControl } from "./cms-control";

export abstract class CmsListControl extends CmsControl {
    get model(): any[] {
        return this._model;
    }
    private _model: any[];

    writeValue(value: any): void {
        this._model = value;
    }

    itemSorted(items) {
        this._model = items;
        this.onChange(this._model);
    }

    insertOrUpdateItem(item) {
        if (!this._model) { this._model = []; }
        const existIndex = this._model.findIndex(x => x.guid == item.guid);
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
        const existIndex = this._model.findIndex(x => x.guid == itemGuid);
        if (existIndex === -1) { return false; }

        this._model.splice(existIndex, 1);
        return true;
    }
}
