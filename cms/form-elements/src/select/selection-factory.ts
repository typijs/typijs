import { SelectItem } from './select-item';
export interface ISelectionFactory {
    GetSelections(): SelectItem[]
}