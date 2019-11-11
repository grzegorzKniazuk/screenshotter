import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { LOAD_SETTINGS, OPEN_DOWNLOAD_FOLDER, UPDATE_SETTINGS } from 'src/app/store/actions';
import { DownloadsService, StorageService, ToastService } from 'src/app/services';
import { tap } from 'rxjs/operators';
import { SETTINGS_STORAGE_KEY } from 'src/app/constants';
import { AppState } from 'src/app/store/index';
import { BaseEffects } from 'src/app/store/effects/base.effects';
import { Settings } from 'src/app/interfaces';
import { Bind } from 'src/app/decorators';

@Injectable({
    providedIn: 'root',
})
export class SettingsEffects extends BaseEffects implements OnInitEffects {

    public init$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ROOT_EFFECTS_INIT),
            StorageService.browserStorageApiAvailability(),
            tap(this.loadExtensionSettingsFromStorage),
            tap(this.updateBytesInUse),
        );
    }, { dispatch: false });

    public readonly onUpdateSettings$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UPDATE_SETTINGS),
            StorageService.browserStorageApiAvailability(),
            tap(this.updateExtensionSettings),
            tap(this.notifyUpdateSettings),
        );
    }, { dispatch: false });

    public readonly onOpenDownloadFolder$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(OPEN_DOWNLOAD_FOLDER),
            DownloadsService.browserDownloadsApiAvailability(),
            tap(this.downloadsService.showDefaultFolder),
        );
    }, { dispatch: false });

    constructor(
        storageService: StorageService,
        protected readonly actions$: Actions,
        store: Store<AppState>,
        private readonly downloadsService: DownloadsService,
        private readonly toastService: ToastService,
        protected readonly ngZone: NgZone,
        applicationRef: ApplicationRef,
    ) {
        super(store, storageService, applicationRef);
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }

    @Bind
    private notifyUpdateSettings(): void {
        this.toastService.success('Settings have been saved');
    }

    @Bind
    private loadExtensionSettingsFromStorage(): void {
        this.storageService.get(SETTINGS_STORAGE_KEY, (items) => {
            this.ngZone.run(() => {
                if (items && items[SETTINGS_STORAGE_KEY]) {
                    this.store.dispatch(LOAD_SETTINGS({ settings: { ...items[SETTINGS_STORAGE_KEY] } }));
                }
            });
        });
    }

    @Bind
    private updateExtensionSettings({ settings }: { settings: Settings }): void {
        this.storageService.set({ [SETTINGS_STORAGE_KEY]: settings }, this.tick);
    }
}
