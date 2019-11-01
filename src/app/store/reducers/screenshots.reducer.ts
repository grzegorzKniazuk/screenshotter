import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { Action, createReducer, on } from '@ngrx/store';
import { ADD_SCREENSHOT, ADD_SCREENSHOTS, CLEAR_SCREENSHOTS_STORAGE, DELETE_SCREENSHOT, INCREASE_NEW_SCREENSHOT_COUNT, RESET_NEW_SCREENSHOT_COUNT } from 'src/app/store/actions';
import { TimeService } from 'src/app/services';

export interface ScreenshotsState extends EntityState<Screenshot> {
    newScreenshotCount: number;
}

const screenshotAdapter = createEntityAdapter<Screenshot>({
    selectId: (screenshot: Screenshot) => screenshot.id,
    sortComparer: (a: Screenshot, b: Screenshot) => {
        if (TimeService.isSame(a.time, b.time, 'minute')) {
            return 0;
        } else {
            if (TimeService.isAfter(a.time, b.time, 'minute')) {
                return -1;
            } else {
                return 1;
            }
        }
    },
});

const initialScreenshotsState = screenshotAdapter.getInitialState({
    newScreenshotCount: 0,
});

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
    on(INCREASE_NEW_SCREENSHOT_COUNT, (state) => {
        return {
            ...state,
            newScreenshotCount: state.newScreenshotCount + 1,
        };
    }),
    on(RESET_NEW_SCREENSHOT_COUNT, (state) => {
        return {
            ...state,
            newScreenshotCount: 0,
        };
    }),
    on(CLEAR_SCREENSHOTS_STORAGE, (state) => {
        return screenshotAdapter.removeAll({
            ...state,
            newScreenshotCount: 0,
        });
    }),
);

export function screenshotsReducer(state: ScreenshotsState, action: Action): ScreenshotsState {
    return reducer(state, action);
}

export const { selectAll, selectTotal } = screenshotAdapter.getSelectors();
