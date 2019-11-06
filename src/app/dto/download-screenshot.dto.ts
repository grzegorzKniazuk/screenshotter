import { Screenshot } from 'src/app/interfaces';

export type DownloadScreenshotDto = Pick<Screenshot, 'data'> & { filename: string };
