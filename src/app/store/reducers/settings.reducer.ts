import { Settings } from 'src/app/interfaces';
import { ConflictAction, FileFormat } from 'src/app/enums';
import { Action, createReducer, on } from '@ngrx/store';
import { UPDATE_SETTINGS } from 'src/app/store/actions';

// tslint:disable-next-line:no-empty-interface
export interface SettingsState extends Settings {
}

const initialSettingsState: SettingsState = {
    autoDownload: false,
    fileFormat: FileFormat.JPEG,
    fileQuality: 100,
    conflictAction: ConflictAction.UNIQUIFY,
    alwaysShowSaveAs: false,
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
