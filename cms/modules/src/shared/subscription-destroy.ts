import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class SubscriptionDestroy implements OnDestroy {
    protected subscriptions: Subscription[] = [];
    ngOnDestroy(): void {
        this.unsubscribe();
    }

    protected unsubscribe() {
        this.subscriptions.forEach(subscriber => subscriber && subscriber.unsubscribe());
    }
}