import { createAction, props } from '@ngrx/store';
import { Image } from 'src/app/interfaces/image';

export const MAKE_SCREENSHOT = createAction(
    '[dashboard nav] make screenshot',
);

export const ADD_SCREENSHOT = createAction(
    '[images effects] add screenshot',
    props<{ image: Image }>(),
);
