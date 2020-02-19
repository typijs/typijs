import { InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export abstract class LocationRef extends Location { }

export function locationFactory(platformId: Object): LocationRef {
    if (isPlatformBrowser(platformId)) {
        return window.location;
    } else {
        return <LocationRef>{};
    }
}

export const WINDOW_LOCATION = new InjectionToken<LocationRef>('WINDOW_LOCATION')