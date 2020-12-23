import { TypeOfContentEnum } from '../../types';
import { ContentService } from './content.service';
import { Block } from './models/block.model';
import { BlockData } from './models/content-data';

@Injectable({
    providedIn: 'root'
})
export class BlockService extends ContentService<Block> {

  protected apiUrl: string = `${this.baseApiUrl}/block`;
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

    isMatching(typeOfContent: string) {
        return typeOfContent === TypeOfContentEnum.Block || typeOfContent === TypeOfContentEnum.FolderBlock;
    }

    getContentData(content: Block): BlockData {
        return new BlockData(content);
    }
}
