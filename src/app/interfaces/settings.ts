import { ConflictAction, FileFormat } from 'src/app/enums';

export interface Settings {
    autoDownload: boolean;
    fileFormat: FileFormat;
    fileQuality: number;
    notifyOnNew: boolean;
    conflictAction: ConflictAction;
    alwaysShowSaveAs: boolean;
}
