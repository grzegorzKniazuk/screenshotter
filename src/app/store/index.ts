import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { imagesReducer, ImagesState } from 'src/app/store/images.reducer';

export interface AppState {
    router: RouterReducerState;
    images: ImagesState;
}

export const appReducers: ActionReducerMap<AppState> = {
    router: routerReducer,
    images: imagesReducer,
};
