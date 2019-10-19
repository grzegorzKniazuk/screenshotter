import { createFeatureSelector } from '@ngrx/store';
import { SettingsState } from 'src/app/store/reducers';

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');
