import { IContent } from "../content";

interface IMedia extends IContent {
    mimeType: string;
    size: string;
}

export { IMedia };