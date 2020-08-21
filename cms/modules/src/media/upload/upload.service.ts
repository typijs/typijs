import { Injectable } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Subject, forkJoin, Observable } from 'rxjs';

import { MediaService } from '@angular-cms/core';
import { TreeNode } from '../../shared/tree/interfaces/tree-node';

export type UploadProgress = {
    [key: string]: { progress: Observable<number> }
};

export type FileUploadProgress = {
    folder: Partial<TreeNode>;
    files: File[];
    uploadProgress: UploadProgress;
};

@Injectable()
export class UploadService {

    fileUploadProgress$: Subject<FileUploadProgress> = new Subject<FileUploadProgress>();
    uploadComplete$: Subject<string> = new Subject<string>();

    constructor(private mediaService: MediaService) { }

    uploadFiles(files: File[], targetFolder: Partial<TreeNode>) {
        const uploadProgress = this.getUploadProgress(files, targetFolder);

        this.fileUploadProgress$.next({
            folder: targetFolder,
            files: files,
            uploadProgress: uploadProgress
        });

        // convert the progress map into an array
        const allProgressObservables = [];
        for (let key in uploadProgress) {
            allProgressObservables.push(uploadProgress[key].progress);
        }
        // When all progress-observables are completed...
        forkJoin(allProgressObservables).subscribe(() => {
            const nodeId = targetFolder ? targetFolder.id : '0';
            this.uploadComplete$.next(nodeId);
        });
    }

    private getUploadProgress(files: File[], targetFolder: Partial<TreeNode>): UploadProgress {
        // this will be the our resulting map
        const uploadProgress: UploadProgress = {};
        const parentFolderId = targetFolder ? targetFolder.id : '';

        files.forEach(file => {
            // create a new progress-subject for every file
            const progress = new BehaviorSubject<number>(0);

            // send the http-request and subscribe for progress-updates
            this.mediaService.uploadMedia(parentFolderId, file).subscribe(event => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        // Compute and show the % done:
                        const percentDone = Math.round(100 * event.loaded / event.total);
                        // pass the percentage into the progress-stream
                        progress.next(percentDone);
                        break;
                    case HttpEventType.Response:
                        // Close the progress-stream if we get an answer form the API
                        // The upload is complete
                        progress.complete();
                        break;
                }
            });

            // Save every progress-observable in a map of all observables
            uploadProgress[file.name] = {
                // tslint:disable-next-line: ban
                progress: progress.asObservable()
            };
        });

        // return the map of progress.observables
        return uploadProgress;
    }
}
