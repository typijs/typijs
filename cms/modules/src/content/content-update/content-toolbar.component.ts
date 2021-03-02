import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentExt } from '../content-crud.service';

@Component({
    selector: 'content-toolbar',
    template: `
    <div class="d-flex">
        <div>
            <content-breadcrumb></content-breadcrumb>
        </div>
        <div class="ml-auto mr-2" *ngIf="currentContent">
          <span class="mr-2 font-weight-bold">{{saveMessage}}</span>
          <button type="button" class="btn btn-sm btn-success mr-1" [disabled]="disabledPublish" (click)="publish.emit()">
            <fa-icon class="mr-1" [icon]="['fas', 'file-export']"></fa-icon>{{ isPublishing ? 'Publishing' : 'Publish'}}
          </button>
          <a class="btn btn-sm btn-primary" target="_blank" [href]="currentContent.linkUrl">
            <fa-icon [icon]="['fas', 'external-link-alt']"></fa-icon>
          </a>
        </div>
        <div class="btn-group" btnRadioGroup [(ngModel)]="editMode">
          <label class="btn btn-sm btn-primary" btnRadio="AllProperties" role="button">
            <fa-icon [icon]="['fas', 'list']"></fa-icon>
          </label>
          <label class="btn btn-sm btn-primary" btnRadio="OnPageEdit" role="button">
            <fa-icon [icon]="['fas', 'desktop']"></fa-icon>
          </label>
        </div>
      </div>
    `
})
export class ContentToolbarComponent {
    @Input() currentContent: ContentExt;
    @Input() isPublishing: boolean;
    @Input() disabledPublish: boolean;
    @Input() saveMessage: string;

    @Input() editMode: 'AllProperties' | 'OnPageEdit';
    @Output() editModeChange = new EventEmitter<'AllProperties' | 'OnPageEdit'>();
    @Output() publish: EventEmitter<any> = new EventEmitter();

}
