import { Observable, Subscriber, Subscription } from 'rxjs';

export abstract class ApiService {

    protected get chrome(): typeof chrome {
        return chrome;
    }

    protected static browserApiAvailability(apiName: string): (source$: Observable<any>) => Observable<any> {
        return (source$: Observable<any>): Observable<any> => {
            return new Observable((subscriber: Subscriber<any>): Subscription => {
                return source$.subscribe(
                    (value: any) => {
                        // @ts-ignore
                        if (chrome[apiName]) {
                            subscriber.next(value);
                        }
                    },
                    (error: any) => subscriber.error(error),
                    () => subscriber.complete(),
                );
            });
        };
    }

    protected browserApiAvailability(apiName: string): boolean {
        // @ts-ignore
        return this.chrome && !!this.chrome[apiName];
    }
}
