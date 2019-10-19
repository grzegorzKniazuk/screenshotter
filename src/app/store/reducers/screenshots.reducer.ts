import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { Action, createReducer, on } from '@ngrx/store';
import { ADD_SCREENSHOT, ADD_SCREENSHOTS, DELETE_SCREENSHOT } from 'src/app/store/actions';

export interface ScreenshotsState extends EntityState<Screenshot> {
}

const screenshotAdapter = createEntityAdapter<Screenshot>({
    selectId: (screenshot: Screenshot) => screenshot.id,
});

const initialScreenshotsState = screenshotAdapter.getInitialState();

const reducer = createReducer(
    initialScreenshotsState,
    on(ADD_SCREENSHOT, (state, { screenshot }) => {
        return screenshotAdapter.addOne(screenshot, state);
    }),
    on(ADD_SCREENSHOTS, (state, { screenshots }) => {
        return screenshotAdapter.addMany(screenshots, state);
    }),
    on(DELETE_SCREENSHOT, (state, { id }) => {
        return screenshotAdapter.removeOne(id, state);
    }),
);

export function screenshotsReducer(state: ScreenshotsState, action: Action): ScreenshotsState {
    return reducer(state, action);
}

export const { selectAll, selectTotal } = screenshotAdapter.getSelectors();
