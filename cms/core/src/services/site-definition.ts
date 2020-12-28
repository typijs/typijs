import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BrowserLocationService } from "../browser/browser-location.service";
import { convertObjectToUrlQueryString } from "../helpers/common";
import { TypeOfContentEnum } from "../types";
import { ContentReference } from "../types/content-reference";
import { BaseService } from "./base.service";

@Injectable({
    providedIn: 'root'
})
export class SiteDefinition extends BaseService {
    protected apiUrl: string = `${this.baseApiUrl}/site-definition`;
    constructor(httpClient: HttpClient, private locationService: BrowserLocationService) {
        super(httpClient);
    }

    /**
     * Get current start page id and the corresponding language based on host.
     *
     * If host is not provided, the current host will be used
     *
     * If the site definition has not defined yet, startPageId = 0 and the first enabled language will be return
     * @param host (Optional) the host name such as mysite.com, www.mysite.org:80
     * @returns Return the Tuple [string, string] type of [startPageId, language]
     */
    current(): Observable<[ContentReference, string]> {
        const host = this.locationService.getLocation().host;
        const query = convertObjectToUrlQueryString({ host });
        return this.httpClient.get<[string, string]>(`${this.apiUrl}/getSiteByHost?${query}`).pipe(
            map(([startPageId, language]) => [new ContentReference({ id: startPageId, type: TypeOfContentEnum.Page }), language])
        );
    }
}
