import { AppState } from 'src/app/store/index';
import { Action, Store } from '@ngrx/store';
import { UPDATE_BYTES_IN_USE } from 'src/app/store/actions';
import { StorageService } from 'src/app/services';
import { Bind } from 'src/app/decorators';
import { ApplicationRef, NgZone } from '@angular/core';
import { Actions } from '@ngrx/effects';

export abstract class BaseEffects {

    protected abstract readonly actions$: Actions;
    protected abstract readonly ngZone: NgZone;

    protected constructor(
        protected readonly store: Store<AppState>,
        protected readonly storageService: StorageService,
        protected readonly applicationRef: ApplicationRef,
    ) {
    }

    public abstract ngrxOnInitEffects(): Action;

    @Bind
    protected updateBytesInUse(): void {
        this.storageService.getBytesInUse((bytesInUse: number) => {
            if (Number.isInteger(bytesInUse)) {
                this.store.dispatch(UPDATE_BYTES_IN_USE({ bytesInUse }));
            }
        });
    }

    @Bind
    protected tick(): void {
        this.applicationRef.tick();
    }
}
