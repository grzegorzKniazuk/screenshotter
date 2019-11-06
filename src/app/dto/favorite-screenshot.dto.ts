import { Screenshot } from 'src/app/interfaces';

export type FavoriteScreenshotDto = Pick<Screenshot, 'id' | 'favorite'>;
