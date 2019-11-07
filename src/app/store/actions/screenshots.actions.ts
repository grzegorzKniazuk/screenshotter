import { createAction, props } from '@ngrx/store';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { DownloadScreenshotDto } from 'src/app/dto';

export const LOAD_SCREENSHOTS = createAction(
    '[dashboard] load screenshots',
);

export const MAKE_SCREENSHOT = createAction(
    '[new screenshot] make screenshot',
);

export const ADD_SCREENSHOT = createAction(
    '[screenshot effects] add screenshot',
    props<{ screenshot: Screenshot }>(),
);

export const SET_SCREENSHOTS = createAction(
    '[screenshot effects] set screenshots',
    props<{ screenshots: Screenshot[] }>(),
);

export const ADD_TO_FAVORITES = createAction(
    '[screenshot gallery] add to favorites',
    props<{ id: string }>(),
);
export const REMOVE_FROM_FAVORITES = createAction(
    '[screenshot gallery] remove from favorites',
    props<{ id: string }>(),
);

export const DELETE_SCREENSHOT = createAction(
    '[screenshot gallery] delete screenshot',
    props<{ id: string }>(),
);

export const DOWNLOAD_SCREENSHOT = createAction(
    '[screenshot gallery] download screenshot',
    props<DownloadScreenshotDto>(),
);

export const OPEN_SCREENSHOT_SOURCE = createAction(
    '[screenshot gallery] open screenshot source',
    props<{ url: string }>(),
);

export const INCREASE_NEW_SCREENSHOT_COUNT = createAction(
    '[screenshot effects] increase new screenshot count',
);

export const RESET_NEW_SCREENSHOT_COUNT = createAction(
    '[dashboard] reset new screenshot count',
);

export const CLEAR_SCREENSHOTS_STORAGE = createAction(
    '[settings] clear screenshots storage',
);

export const SET_NEW_SCREENSHOT_COUNT = createAction(
    '[app effects] set new screenshot count',
    props<{ newScreenshotCount: number }>(),
);

export const PREVIEW_SCREENSHOT = createAction(
    `[screenshot gallery] preview screenshot`,
    props<{ data: string }>(),
);
