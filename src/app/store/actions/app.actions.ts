import { createAction, props } from '@ngrx/store';

export const SET_BADGE_TEXT = createAction(
    '[screenshots effects] set badge text',
    props<{ text: string }>(),
);

export const REMOVE_BADGE_TEXT = createAction(
    '[screenshots effects] remove badge text',
);

export const OPEN_BROWSER_TAB = createAction(
    '[app effects] open browser tab',
    props<{ url: string }>(),
);
