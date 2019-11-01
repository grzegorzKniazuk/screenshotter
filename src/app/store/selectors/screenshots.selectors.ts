import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ScreenshotsState, selectAll } from 'src/app/store/reducers';

const selectScreenshotsState = createFeatureSelector<ScreenshotsState>('screenshots');

export const selectScreenshots = createSelector(
    selectScreenshotsState,
    selectAll,
);

export const selectNewScreenshotCounter = createSelector(
    selectScreenshotsState,
    (state) => state.newScreenshotCount,
);
