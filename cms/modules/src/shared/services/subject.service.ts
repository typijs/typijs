import { Injectable } from '@angular/core';
import { Block, Media, Page, TypeOfContent } from '@typijs/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ContentAreaItem } from '../../properties/content-area/content-area.model';

@Injectable({
    // we declare that this service should be created
    // by the root application injector.
    providedIn: 'root',
})
export class SubjectService {

    blockFolderCreated$: Observable<Block>;
    blockCreated$: Observable<Block>;
    mediaFolderCreated$: Observable<Media>;
    mediaCreated$: Observable<Media>;
    pageCreated$: Observable<Page>;
    pageSelected$: Observable<Page>;
    contentDropFinished$: Observable<Partial<ContentAreaItem>>;
    portalLayoutChanged$: Observable<boolean>;
    contentSelected$: Observable<[TypeOfContent, Page | Block | Media]>;
    contentStatusChanged$: Observable<[TypeOfContent, Page | Block | Media]>;

    private _blockFolderCreated$: Subject<Block> = new Subject<Block>();
    private _blockCreated$: Subject<Block> = new Subject<Block>();
    private _mediaFolderCreated$: Subject<Media> = new Subject<Media>();
    private _mediaCreated$: Subject<Media> = new Subject<Media>();
    private _pageCreated$: Subject<Page> = new Subject<Page>();
    private _pageSelected$: Subject<Page> = new Subject<Page>();
    private _contentSelected$: Subject<[TypeOfContent, Page | Block | Media]> = new Subject<[TypeOfContent, Page | Block | Media]>();
    private _contentStatusChanged$: Subject<[TypeOfContent, Page | Block | Media]> = new Subject<[TypeOfContent, Page | Block | Media]>();
    private _contentDropFinished$: Subject<Partial<ContentAreaItem>> = new Subject<Partial<ContentAreaItem>>();
    private _portalLayoutChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
        this.blockFolderCreated$ = this._blockFolderCreated$.asObservable();
        this.blockCreated$ = this._blockCreated$.asObservable();
        this.mediaFolderCreated$ = this._mediaFolderCreated$.asObservable();
        this.mediaCreated$ = this._mediaCreated$.asObservable();
        this.pageCreated$ = this._pageCreated$.asObservable();
        this.pageSelected$ = this._pageSelected$.asObservable();
        this.contentSelected$ = this._contentSelected$.asObservable();
        this.contentStatusChanged$ = this._contentStatusChanged$.asObservable();
        this.contentDropFinished$ = this._contentDropFinished$.asObservable();
        this.portalLayoutChanged$ = this._portalLayoutChanged$.asObservable();
    }

    fireBlockFolderCreated(createdBlockFolder: Block) {
        this._blockFolderCreated$.next(createdBlockFolder);
    }

    fireBlockCreated(createdBlock: Block) {
        this._blockCreated$.next(createdBlock);
    }

    fireMediaFolderCreated(createdMediaFolder: Media) {
        this._mediaFolderCreated$.next(createdMediaFolder);
    }

    fireMediaCreated(createdMedia: Media) {
        this._mediaCreated$.next(createdMedia);
    }

    firePageCreated(createdPage: Page) {
        this._pageCreated$.next(createdPage);
    }

    firePageSelected(selectedPage: Page) {
        this._pageSelected$.next(selectedPage);
    }

    fireContentSelected(type: TypeOfContent, selectedContent: Page | Block | Media) {
        this._contentSelected$.next([type, selectedContent]);
    }

    fireContentStatusChanged(type: TypeOfContent, selectedContent: Page | Block | Media) {
        this._contentStatusChanged$.next([type, selectedContent]);
    }

    fireContentDropFinished(contentAreaItem: Partial<ContentAreaItem>) {
        this._contentDropFinished$.next(contentAreaItem);
    }

    firePortalLayoutChanged(isLayoutChanging: boolean) {
        this._portalLayoutChanged$.next(isLayoutChanging);
    }
}
