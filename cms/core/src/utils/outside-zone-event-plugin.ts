import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

/**
 * Credit to Michael Strobel from:
 * https://github.com/kryops/ng2-events
 */
@Injectable()
export class OutsideZoneEventPlugin {
    manager: EventManager;
    private prefixEventName = 'outside-angular-zone.';

    supports(eventName: string): boolean {
        return eventName.indexOf(this.prefixEventName) === 0;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
        const realEventName = eventName.slice(this.prefixEventName.length);
        return this.manager.getZone().runOutsideAngular(() => this.manager.addEventListener(element, realEventName, handler));
    }
}