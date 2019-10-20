import { ConflictAction, FileFormat } from 'src/app/enums';

export interface Settings {
    autoDownload: boolean;
    fileFormat: FileFormat;
    fileQuality: number;
    conflictAction: ConflictAction;
    alwaysShowSaveAs: boolean;
}
