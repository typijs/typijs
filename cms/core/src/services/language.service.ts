import { Injectable } from '@angular/core';
import { BrowserLocationService } from '../browser/browser-location.service';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    /**
     * Empty language is used in folder
     */
    readonly EMPTY_LANGUAGE: string = '0';
    constructor(private locationService: BrowserLocationService) { }

    getLanguageParam(): string {
        const urlParams = this.locationService.getURLSearchParams();
        return urlParams.get('language');
    }
}
