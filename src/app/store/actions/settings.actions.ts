import { createAction, props } from '@ngrx/store';
import { Settings } from 'src/app/interfaces';

export const LOAD_SETTINGS = createAction(
    '[settings effects] load settings',
    props<{ settings: Settings }>(),
);

export const UPDATE_SETTINGS = createAction(
    '[settings] update settings',
    props<{ settings: Settings }>(),
);

export const OPEN_DOWNLOAD_FOLDER = createAction(
    `[settings] open download folder`,
);

export const UPDATE_BYTES_IN_USE = createAction(
    '[settings effects] update bytes in use',
    props<{ bytesInUse: number }>(),
);
