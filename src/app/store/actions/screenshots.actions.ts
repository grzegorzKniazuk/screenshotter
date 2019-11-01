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

export const DELETE_SCREENSHOT = createAction(
    '[screenshot card] delete screenshot',
    props<{ id: string }>(),
);

export const DOWNLOAD_SCREENSHOT = createAction(
    '[screenshot card] download screenshot',
    props<DownloadScreenshotDto>(),
);

export const OPEN_SOURCE = createAction(
    '[screenshot card] open source',
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
