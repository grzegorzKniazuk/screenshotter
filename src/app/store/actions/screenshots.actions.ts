import { createAction, props } from '@ngrx/store';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { DownloadScreenshotDto } from 'src/app/dto';

export const MAKE_SCREENSHOT = createAction(
    '[dashboard nav] make screenshot',
);

export const ADD_SCREENSHOT = createAction(
    '[screenshot effects] add screenshot',
    props<{ screenshot: Screenshot }>(),
);

export const ADD_SCREENSHOTS = createAction(
    '[screenshot effects] add screenshots',
    props<{ screenshots: Screenshot[] }>(),
);

export const ADD_TO_FAVORITES = createAction(
    '[screenshot card] add to favorites',
    props<{ id: string }>(),
);
export const REMOVE_FROM_FAVORITES = createAction(
    '[screenshot card] remove from favorites',
    props<{ id: string }>(),
);

export const DELETE_SCREENSHOT = createAction(
    '[screenshot card] delete screenshot',
    props<{ id: string }>(),
);

export const DOWNLOAD_SCREENSHOT = createAction(
    '[screenshot card] download screenshot',
    props<DownloadScreenshotDto>(),
);

export const OPEN_SCREENSHOT_SOURCE = createAction(
    '[screenshot card] open screenshot source',
    props<{ url: string }>(),
);

export const INCREASE_NEW_SCREENSHOT_COUNT = createAction(
    '[screenshot effects] increase new screenshot count',
);

export const RESET_NEW_SCREENSHOT_COUNT = createAction(
    '[screenshot gallery] reset new screenshot count',
);

export const CLEAR_SCREENSHOTS_STORAGE = createAction(
    '[settings] clear screenshots storage',
);

export const SET_NEW_SCREENSHOT_COUNT = createAction(
    '[app effects] set new screenshot count',
    props<{ newScreenshotCount: number }>(),
);

export const PREVIEW_SCREENSHOT = createAction(
    `[screenshot card] preview screenshot`,
    props<{ data: string }>(),
);
