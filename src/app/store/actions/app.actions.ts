import { createAction, props } from '@ngrx/store';

export const SET_BADGE_TEXT = createAction(
    '[browser] set badge text',
    props<{ text: string }>(),
);

export const REMOVE_BADGE_TEXT = createAction(
    '[browser] remove badge text',
);
