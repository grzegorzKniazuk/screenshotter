import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ScreenshotsState, selectAll } from 'src/app/store/reducers';
import { Screenshot } from 'src/app/interfaces';

const selectScreenshotsState = createFeatureSelector<ScreenshotsState>('screenshots');

export const selectScreenshots = createSelector(
    selectScreenshotsState,
    selectAll,
);

export const selectNewScreenshotCounter = createSelector(
    selectScreenshotsState,
    (state) => state.newScreenshotCount,
);

export const selectScreenshotsByQuery = createSelector(
    selectScreenshots,
    (screenshots: Screenshot[], { title }: { title: string }) => {
        return screenshots.filter((screenshot) => screenshot.title.toLowerCase().includes(title.toLowerCase()));
    },
);
