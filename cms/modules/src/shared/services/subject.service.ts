import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Page, Block, Media } from '@angular-cms/core';
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

    private _blockFolderCreated$: Subject<Block> = new Subject<Block>();
    private _blockCreated$: Subject<Block> = new Subject<Block>();
    private _mediaFolderCreated$: Subject<Media> = new Subject<Media>();
    private _mediaCreated$: Subject<Media> = new Subject<Media>();
    private _pageCreated$: Subject<Page> = new Subject<Page>();
    private _pageSelected$: Subject<Page> = new Subject<Page>();
    private _contentDropFinished$: Subject<Partial<ContentAreaItem>> = new Subject<Partial<ContentAreaItem>>();
    private _portalLayoutChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
        this.blockFolderCreated$ = this._blockFolderCreated$.asObservable();
        this.blockCreated$ = this._blockCreated$.asObservable();
        this.mediaFolderCreated$ = this._mediaFolderCreated$.asObservable();
        this.mediaCreated$ = this._mediaCreated$.asObservable();
        this.pageCreated$ = this._pageCreated$.asObservable();
        this.pageSelected$ = this._pageSelected$.asObservable();
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

    fireContentDropFinished(contentAreaItem: Partial<ContentAreaItem>) {
        this._contentDropFinished$.next(contentAreaItem);
    }

    firePortalLayoutChanged(isLayoutChanging: boolean) {
        this._portalLayoutChanged$.next(isLayoutChanging);
    }
}
