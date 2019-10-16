import { NavigationActionTiming, RouterState, StoreRouterConfig } from '@ngrx/router-store';

export const STORE_ROUTER_CONNECTING_CONFIG: StoreRouterConfig<any> = {
    routerState: RouterState.Minimal,
    navigationActionTiming: NavigationActionTiming.PostActivation,
};
