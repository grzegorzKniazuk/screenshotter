import { createAction, props } from '@ngrx/store';
import { Settings } from 'src/app/interfaces';

export const UPDATE_SETTINGS = createAction(
    '[settings] update settings',
    props<{ settings: Settings }>(),
);
