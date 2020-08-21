import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

/**
 * Listen to events without triggering change detection
 *
 * Credit: https://github.com/kryops/ng2-events/blob/master/src/undetected/undetected.event.ts
 *
 * Usage:
 * <button (undetected.click)="handleClick()"></button>
 */
@Injectable()
export class UndetectedEventPlugin {
    manager: EventManager;
    private prefixEventName = 'undetected.';

    supports(eventName: string): boolean {
        return eventName.indexOf(this.prefixEventName) === 0;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
        const realEventName = eventName.slice(this.prefixEventName.length);
        return this.manager.getZone().runOutsideAngular(() => this.manager.addEventListener(element, realEventName, handler));
    }
}
