import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Content, TypeOfContent } from '@typijs/core';
import { Observable } from 'rxjs';

export const CONTENT_VERSION_SERVICES: InjectionToken<ContentVersionService[]> = new InjectionToken<ContentVersionService[]>('CONTENT_VERSION_SERVICES');

export abstract class ContentVersionService {
    constructor(public typeOfContent: TypeOfContent) { }
    isMatching(typeOfContent: TypeOfContent): boolean {
        return this.typeOfContent === typeOfContent;
    }

    abstract getAllVersions(contentId: string): Observable<Content[]>;
    abstract createNewVersion(masterVersionId: string): Observable<Content>;
    abstract setVersionIsPrimary(versionId: string): Observable<Content>;
    abstract deleteVersion(versionId: string): Observable<Content>;
}

@Injectable()
export class ContentVersionServiceResolver {
    constructor(@Inject(CONTENT_VERSION_SERVICES) private contentVersionServices: ContentVersionService[]) { }

    resolveContentVersionService(typeOfContent: string): ContentVersionService {
        return this.contentVersionServices.find(x => x.isMatching(typeOfContent));
    }
}
