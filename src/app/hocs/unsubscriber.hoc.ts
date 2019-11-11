import { ɵComponentDef } from '@angular/core';
import { Subscription } from 'rxjs';

export function Unsubscriber() {
    return (componentType: any) => {
        const originalFactory = (componentType.ngComponentDef as ɵComponentDef<any>).factory;

        (componentType.ngComponentDef as ɵComponentDef<any>).factory = (...args: any[]) => {
            const component = originalFactory(...args);

            (componentType.ngComponentDef as ɵComponentDef<any>).onDestroy = () => {
                if (component.onDestroy) {
                    component.onDestroy();
                }

                if (component.hasOwnProperty('subscriptions$')) {
                    (component.subscriptions$ as Subscription).unsubscribe();
                } else {
                    throw new Error('No subscriptions$ definition');
                }
            };

            return component;
        };

        return componentType;
    };
}
