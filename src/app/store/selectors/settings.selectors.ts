import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from 'src/app/store/reducers';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectAutoDownloadState = createSelector(
    selectSettingsState,
    (state) => state.autoDownload,
);

export const selectBytesInUse = createSelector(
    selectSettingsState,
    (state) => state.bytesInUse,
);
