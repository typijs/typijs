export type SelectItem = {
    text: string;
    value: string;
};
export interface ISelectionFactory {
    GetSelections(): SelectItem[];
}
