import { StorageConfig } from '@ngx-pwa/local-storage';

const LOCAL_STORAGE_PREFIX = 'APP_';
const LOCAL_DB_NAME = 'screenShotter';
const LOCAL_DB_STORE_NAME = 'screenShotterStorage';

export const STORAGE_MODULE_CONFIG: StorageConfig = {
    LSPrefix: LOCAL_STORAGE_PREFIX,
    IDBDBName: LOCAL_DB_NAME,
    IDBStoreName: LOCAL_DB_STORE_NAME,
    IDBNoWrap: true,
};

