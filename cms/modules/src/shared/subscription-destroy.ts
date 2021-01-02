import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

// TODO: Add Angular decorator.
export abstract class SubscriptionDestroy implements OnDestroy {
    protected unsubscribe$: Subject<any> = new Subject();

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
