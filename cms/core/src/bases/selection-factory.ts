import { Observable } from 'rxjs';

export type SelectItem = {
    text: string;
    value: string | number | boolean;
    [key: string]: any;
};
export interface ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]>;
}
