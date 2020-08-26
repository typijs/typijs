import { ElementRef, NgZone, OnDestroy, OnInit, Renderer2, Injector } from '@angular/core';
import { BrowserLocationService } from '../browser/browser-location.service';
import { ngEditMode } from '../constants';

export abstract class PropertyDirectiveBase implements OnInit, OnDestroy {

    ngEditMode: boolean = false;

    private zone: NgZone;
    private renderer: Renderer2;
    private locationService: BrowserLocationService;
    private unbindMouseEnterListener: Function;
    private unbindMouseLeaveListener: Function;

    constructor(injector: Injector, private elementRef: ElementRef) {
        this.zone = injector.get(NgZone);
        this.renderer = injector.get(Renderer2);
        this.locationService = injector.get(BrowserLocationService);
    }

    ngOnInit() {
        this.ngEditMode = this.getEditModeFlag();
        // TODO: need to check is authenticate and user belong Editor group
        if (this.ngEditMode) {
            this.setDefaultBorderStyle();
            // TODO: The event will work fine when putting the register in zone.runOutsideAngular. Need to find out.
            this.zone.runOutsideAngular(() => {
                this.unbindMouseEnterListener = this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', () => {
                    this.setHoverBorderStyle();
                });
                this.unbindMouseLeaveListener = this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => {
                    this.setDefaultBorderStyle();
                });
            });
        }
    }

    private getEditModeFlag(): boolean {
        const params = this.locationService.getURLSearchParams();
        return params.get(ngEditMode) === 'True' || params.get(ngEditMode) === 'true';
    }

    private setDefaultBorderStyle() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'outline', '1px solid #35cbff');
        this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', '');
    }

    private setHoverBorderStyle() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'outline', '1px solid #9FC733');
        this.renderer.setStyle(this.elementRef.nativeElement, 'box-shadow', '0 0 5px #9FC733');
    }

    ngOnDestroy() {
        if (this.unbindMouseEnterListener) { this.unbindMouseEnterListener(); }
        if (this.unbindMouseLeaveListener) { this.unbindMouseLeaveListener(); }
    }
}
