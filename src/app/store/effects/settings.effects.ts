import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { OPEN_DOWNLOAD_FOLDER, UPDATE_SETTINGS } from 'src/app/store/actions';
import { StorageService } from 'src/app/services';
import { tap } from 'rxjs/operators';
import { SETTINGS_STORAGE_KEY } from 'src/app/constants';
import { AppState } from 'src/app/store/index';
import { DownloadsService } from 'src/app/services/downloads.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsEffects implements OnInitEffects {

    public init$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ROOT_EFFECTS_INIT),
            StorageService.browserStorageApiAvailability(),
            tap(() => {
                this.storageService.get(SETTINGS_STORAGE_KEY, (items) => {
                    this.store.dispatch(UPDATE_SETTINGS({ settings: { ...items[SETTINGS_STORAGE_KEY] } }));
                });
            }),
        );
    }, { dispatch: false });

    public readonly onUpdateSettings = createEffect(() => {
        return this.actions$.pipe(
            ofType(UPDATE_SETTINGS),
            StorageService.browserStorageApiAvailability(),
            tap(({ settings }) => this.storageService.set({ [SETTINGS_STORAGE_KEY]: settings })),
        );
    }, { dispatch: false });

    public readonly onOpenDownloadFolder = createEffect(() => {
        return this.actions$.pipe(
            ofType(OPEN_DOWNLOAD_FOLDER),
            DownloadsService.browserDownloadsApiAvailability(),
            tap(() => this.downloadsService.showDefaultFolder()),
        );
    }, { dispatch: false });

    constructor(
        private readonly storageService: StorageService,
        private readonly actions$: Actions,
        private readonly store: Store<AppState>,
        private readonly downloadsService: DownloadsService,
    ) {
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }
}
