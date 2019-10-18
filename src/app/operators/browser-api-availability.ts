import {} from 'chrome';
import { Observable, Subscriber, Subscription } from 'rxjs';

export function browserApiAvailability(api: string): (source$: Observable<any>) => Observable<any> {
    return (source$: Observable<any>): Observable<any> => {
        return new Observable((subscriber: Subscriber<any>): Subscription => {
            return source$.subscribe(
                (value: any) => {
                    // @ts-ignore
                    if (chrome[api]) {
                        subscriber.next(value);
                    }
                },
                (error: any) => subscriber.error(error),
                () => subscriber.complete(),
            );
        });
    };
}

export function browserStorageApiAvailability() {
    return browserApiAvailability('storage');
}

export function browserTabsApiAvailability() {
    return browserApiAvailability('tabs');
}
