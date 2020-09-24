import { BaseService } from '@angular-cms/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class CrudService<T, ID> extends BaseService {
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    save(t: T): Observable<T> {
        return this.httpClient.post<T>(this.apiUrl, t);
    }

    update(id: ID, t: T): Observable<T> {
        return this.httpClient.put<T>(`${this.apiUrl}/${id}`, t, {});
    }

    findOne(id: ID): Observable<T> {
        return this.httpClient.get<T>(`${this.apiUrl}/${id}`);
    }

    findAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(this.apiUrl);
    }

    delete(id: ID): Observable<T> {
        return this.httpClient.delete<T>(this.apiUrl + '/' + id);
    }
}
