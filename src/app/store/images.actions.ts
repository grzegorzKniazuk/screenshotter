import { createAction, props } from '@ngrx/store';
import { Image } from 'src/app/interfaces/image';

export const MAKE_SCREENSHOT = createAction(
    '[dashboard nav] make screenshot',
);

export const ADD_SCREENSHOT = createAction(
    '[screenshot effects] add screenshot',
    props<{ image: Image }>(),
);

export const ADD_SCREENSHOTS = createAction(
    '[screenshots effects] add screenshots',
    props<{ images: Image[] }>(),
);

export const DELETE_SCREENSHOT = createAction(
    '[screenshot card] delete screenshot',
    props<{ id: string }>(),
);
