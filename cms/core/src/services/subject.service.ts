import { Subject } from 'rxjs';

import { Page } from '../models/page.model';
import { Block } from '../models/block.model';

export class SubjectService {

  blockFolderCreated$: Subject<Block> = new Subject<Block>();
  pageCreated$: Subject<Page> = new Subject<Page>();
  pageSelected$: Subject<Page> = new Subject<Page>();

  fireBlockCreated(blockData) {
    this.blockFolderCreated$.next(blockData);
  }

  firePageCreated(pageData) {
    this.pageCreated$.next(pageData);
  }

  firePageSelected(pageData) {
    this.pageSelected$.next(pageData);
  }
}
