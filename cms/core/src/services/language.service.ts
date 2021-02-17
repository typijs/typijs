import { Injectable } from '@angular/core';
import { BrowserLocationService } from '../browser/browser-location.service';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    constructor(private locationService: BrowserLocationService) { }

    getLanguageParam(): string {
        const urlParams = this.locationService.getURLSearchParams();
        return urlParams.get('language');
    }
}
