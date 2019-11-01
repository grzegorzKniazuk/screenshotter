import { AppState } from 'src/app/store/index';
import { Store } from '@ngrx/store';
import { Bind } from 'lodash-decorators';
import { UPDATE_BYTES_IN_USE } from 'src/app/store/actions';
import { StorageService } from 'src/app/services';

export abstract class BaseEffects {
    protected constructor(
        protected readonly store: Store<AppState>,
        protected readonly storageService: StorageService,
    ) {
    }

    @Bind
    protected updateBytesInUse(): void {
        this.storageService.getBytesInUse((bytesInUse: number) => {
            this.store.dispatch(UPDATE_BYTES_IN_USE({ bytesInUse }));
        });
    }
}
