import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { screenshotsReducer, ScreenshotsState, settingsReducer, SettingsState } from 'src/app/store/reducers';

export interface AppState {
    router: RouterReducerState;
    screenshots: ScreenshotsState;
    settings: SettingsState;
}

export const appReducers: ActionReducerMap<AppState> = {
    router: routerReducer,
    screenshots: screenshotsReducer,
    settings: settingsReducer,
};
