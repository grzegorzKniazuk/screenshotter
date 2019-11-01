import { Settings } from 'src/app/interfaces';
import { ConflictAction, FileFormat } from 'src/app/enums';
import { Action, createReducer, on } from '@ngrx/store';
import { LOAD_SETTINGS, UPDATE_BYTES_IN_USE, UPDATE_SETTINGS } from 'src/app/store/actions';

export interface SettingsState extends Settings {
    bytesInUse: number;
}

const initialSettingsState: SettingsState = {
    autoDownload: false,
    fileFormat: FileFormat.JPEG,
    fileQuality: 100,
    conflictAction: ConflictAction.UNIQUIFY,
    alwaysShowSaveAs: false,
    bytesInUse: null,
};

const reducer = createReducer(
    initialSettingsState,
    on(UPDATE_SETTINGS, LOAD_SETTINGS, (state, { settings }) => {
        return {
            ...state,
            ...settings,
        };
    }),
    on(UPDATE_BYTES_IN_USE, (state, { bytesInUse }) => {
        return {
            ...state,
            bytesInUse,
        };
    })
);

export function settingsReducer(state: SettingsState, action: Action): SettingsState {
    return reducer(state, action);
}
