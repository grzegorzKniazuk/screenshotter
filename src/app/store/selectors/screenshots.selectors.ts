import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ScreenshotsState, selectAll, selectTotal } from 'src/app/store/reducers';

const selectScreenshotsState = createFeatureSelector<ScreenshotsState>('screenshots');

export const selectScreenshots = createSelector(
    selectScreenshotsState,
    selectAll,
);

export const selectTotalScreenshots = createSelector(
    selectScreenshotsState,
    selectTotal
);
