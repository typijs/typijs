import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";
import { TreeNode } from '../../shared/tree';

//Temp hardcode url
const url = 'http://localhost:4200/api/media/upload/';

@Injectable()
export class UploadService {

    parentFolder: TreeNode;
    openFileDialog$: Subject<any> = new Subject<any>();
    uploadComplete$: Subject<any> = new Subject<any>();

    constructor(private http: HttpClient) { }

    private uploadFiles(files: Array<File>): { [key: string]: any } {
        // this will be the our resulting map
        const uploadStatus = {};
        var requestUrl = this.parentFolder ? `${url}${this.parentFolder.id}` : `${url}`;

        files.forEach(file => {
            // create a new multipart-form for every file
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);

            // create a http-post request and pass the form
            // tell it to report the upload progress
            const req = new HttpRequest('POST', requestUrl, formData, {
                reportProgress: true
            });

            // create a new progress-subject for every file
            const progress = new BehaviorSubject<number>(0);

            // send the http-request and subscribe for progress-updates
            this.http.request(req).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {

                    // calculate the progress percentage
                    const percentDone = Math.round(100 * event.loaded / event.total);

                    // pass the percentage into the progress-stream
                    progress.next(percentDone);
                } else if (event instanceof HttpResponse) {

                    // Close the progress-stream if we get an answer form the API
                    // The upload is complete
                    progress.complete();
                }
            });

            // Save every progress-observable in a map of all observables
            uploadStatus[file.name] = {
                progress: progress.asObservable()
            };
        });

        // return the map of progress.observables
        return uploadStatus;
    }

    public setFilesToUpload(files: Array<File>) {
        let uploadProgress = this.uploadFiles(files);
        this.openFileDialog$.next({ files: files, uploadProgress: uploadProgress });

        // convert the progress map into an array
        let allProgressObservables = [];
        for (let key in uploadProgress) {
            allProgressObservables.push(uploadProgress[key].progress);
        }
        // When all progress-observables are completed...
        forkJoin(allProgressObservables).subscribe(end => {
            let nodeId = this.parentFolder ? this.parentFolder.id : '0';
            this.uploadComplete$.next(nodeId);
        });
    }

    public setParentFolder(parentNode: TreeNode) {
        this.parentFolder = parentNode;
    }
}