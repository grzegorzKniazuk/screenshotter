import { FileFormat } from 'src/app/enums';

export interface Screenshot {
    id: string;
    title: string;
    url: string;
    src: string;
    time: string;
    quality: number;
    format: FileFormat;
    size: number;
}
