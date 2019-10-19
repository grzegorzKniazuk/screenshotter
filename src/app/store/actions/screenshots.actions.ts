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
    '[screenshots effects] add screenshots',
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
