import { ConflictAction, FileFormat } from 'src/app/enums';

export interface Settings {
    fileFormat: FileFormat;
    fileQuality: number;
    conflictAction: ConflictAction;
    alwaysShowSaveAs: boolean;
}
