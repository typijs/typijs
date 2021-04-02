import { Injectable, Injector } from '@angular/core';
import { ContentTypeEnum } from '../../constants/content-type.enum';
import { ContentService } from './content.service';
import { Block } from './models/block.model';
import { BlockData } from './models/content-data';

@Injectable({
    providedIn: 'root'
})
export class BlockService extends ContentService<Block> {

    protected apiUrl: string = `${this.baseApiUrl}/block`;
    constructor(injector: Injector) {
        super(injector);
    }

    isMatching(typeOfContent: string) {
        this.typeOfContent = typeOfContent;
        return typeOfContent === ContentTypeEnum.Block || typeOfContent === ContentTypeEnum.FolderBlock;
    }

    getContentData(content: Block): BlockData {
        return new BlockData(content);
    }
}
