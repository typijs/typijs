import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export abstract class SubscriptionComponent implements OnDestroy {
    protected subscriptions: Subscription[] = [];
    ngOnDestroy(): void {
        this.subscriptions.forEach(subscriber => subscriber && subscriber.unsubscribe());
    }
}