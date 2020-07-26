import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl, SafeScript, SafeStyle } from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    public transform(value: any, type: string): SafeHtml | SafeUrl | SafeResourceUrl | SafeScript | SafeStyle {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resource':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            default:
                return this.sanitizer.bypassSecurityTrustHtml(value);
        }
    }
}