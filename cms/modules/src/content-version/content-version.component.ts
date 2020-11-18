import { Content, TypeOfContent } from '@angular-cms/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SubjectService } from '../shared/services/subject.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { ContentVersionModel } from './content-version.model';
import { ContentVersionService, ContentVersionServiceResolver } from './content-version.service';

@Component({
    template: `
        <div>
            <h5>Versions</h5>
            <cms-table [modelType]="modelType" [rows]="versions$ | async" (rowClick)="gotoVersion($event)"></cms-table>
        </div>
    `
})
export class ContentVersionComponent extends SubscriptionDestroy implements OnInit {
    modelType: new () => ContentVersionModel = ContentVersionModel;
    versions$: Observable<Content[]>;
    private versionService: ContentVersionService;
    private typeOfContent: TypeOfContent;

    constructor(
        private router: Router,
        private subjectService: SubjectService,
        private versionServiceResolver: ContentVersionServiceResolver) { super(); }
    ngOnInit(): void {
        this.versions$ = this.subjectService.contentSelected$
            .pipe(
                distinctUntilChanged((a, b) => a[1]._id === b[1]._id && a[0] === b[0]),
                switchMap(([type, content]) => {
                    this.typeOfContent = type;
                    this.versionService = this.versionServiceResolver.resolveContentVersionService(this.typeOfContent);
                    return this.versionService.getAllVersions(content._id);
                }),
            );
    }

    gotoVersion(version: ContentVersionModel) {
        this.router.navigate(['/cms/editor/content/', this.typeOfContent, version._id]);
    }
}
