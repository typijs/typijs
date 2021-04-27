import { MediaService } from '@typijs/core';
import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { TreeNode } from '../../shared/tree/interfaces/tree-node';

export type UploadProgress = {
    [key: string]: { progress: Observable<number> }
};

export type FileUploadProgress = {
    files?: File[];
    uploadProgress?: UploadProgress;
    uploadFolder: Partial<TreeNode>;
};

@Injectable()
export class UploadService {

    uploadComplete$: Subject<string> = new Subject<string>();

    constructor(private mediaService: MediaService) { }

    uploadFiles(files: File[], uploadFolder: Partial<TreeNode>): Observable<FileUploadProgress> {
        const fileUploadProgress = this.getUploadProgress(files, uploadFolder);
        const allProgressObservables = [];
        for (let key in fileUploadProgress.uploadProgress) {
            allProgressObservables.push(fileUploadProgress.uploadProgress[key].progress);
        }
        // When all progress-observables are completed...
        forkJoin(allProgressObservables).subscribe(() => {
            const nodeId = uploadFolder ? uploadFolder.id : '0';
            this.uploadComplete$.next(nodeId);
        });

        return of(fileUploadProgress);
    }

    private getUploadProgress(files: File[], uploadFolder: Partial<TreeNode>): FileUploadProgress {
        // this will be the our resulting map
        const uploadProgress: UploadProgress = {};
        const parentFolderId = uploadFolder ? uploadFolder.id : '';

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
        return {
            files,
            uploadProgress,
            uploadFolder
        }
    }
}
