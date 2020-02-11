import { InjectionToken } from '@angular/core';

export abstract class LocationRef extends Location { }
export const LOCATION = new InjectionToken<LocationRef>('LocationToken');
export function locationFactory(): LocationRef { return window.location; }