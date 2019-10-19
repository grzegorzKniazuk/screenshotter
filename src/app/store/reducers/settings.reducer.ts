import { Settings } from 'src/app/interfaces';
import { FileFormat } from 'src/app/enums';
import { Action, createReducer, on } from '@ngrx/store';
import { UPDATE_SETTINGS } from 'src/app/store/actions';

// tslint:disable-next-line:no-empty-interface
export interface SettingsState extends Settings {
}

const initialSettingsState: SettingsState = {
    fileFormat: FileFormat.JPEG,
    fileQuality: 100,
};

const reducer = createReducer(
    initialSettingsState,
    on(UPDATE_SETTINGS, (state, { settings }) => {
        return {
            ...state,
            ...settings,
        };
    }),
);

export function settingsReducer(state: SettingsState, action: Action): SettingsState {
    return reducer(state, action);
}
