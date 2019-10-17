import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImagesState, selectAll, selectTotal } from './images.reducer';

const selectImagesState = createFeatureSelector<ImagesState>('images');

export const selectImages = createSelector(
    selectImagesState,
    selectAll,
);

export const selectTotalImages = createSelector(
    selectImagesState,
    selectTotal
);
