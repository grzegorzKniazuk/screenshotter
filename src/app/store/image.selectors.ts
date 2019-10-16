import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImagesState, selectAll } from './images.reducer';

const selectImagesState = createFeatureSelector<ImagesState>('images');

export const selectRecipes = createSelector(
    selectImagesState,
    selectAll,
);
