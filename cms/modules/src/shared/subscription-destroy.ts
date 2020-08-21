import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class SubscriptionDestroy implements OnDestroy {
    protected unsubscribe$: Subject<any> = new Subject();

    ngOnDestroy(): void {
        this.onUnsubscribe();
    }

    protected onUnsubscribe() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
