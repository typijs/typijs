import { IContent } from "../content";

export interface IBlock extends IContent {
    childItems: any[];
}