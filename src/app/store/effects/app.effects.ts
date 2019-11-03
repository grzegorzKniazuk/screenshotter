import { Injectable } from '@angular/core';
import { BaseEffects } from 'src/app/store/effects/base.effects';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/index';
import { BrowserActionService, StorageService } from 'src/app/services';
import { tap } from 'rxjs/operators';
import { REMOVE_BADGE_TEXT, SET_BADGE_TEXT, SET_NEW_SCREENSHOT_COUNT } from 'src/app/store/actions';
import { Bind } from 'lodash-decorators';
import { NEW_SCREENSHOT_COUNT_STORAGE_KEY } from 'src/app/constants';

@Injectable()
export class AppEffects extends BaseEffects implements OnInitEffects {

    public readonly onAppInit$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ROOT_EFFECTS_INIT),
            StorageService.browserStorageApiAvailability(),
            tap(this.loadNewScreenshotCounterFromStorage),
        );
    }, { dispatch: false });

    public readonly onUpdateBadgeText$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(SET_BADGE_TEXT),
            BrowserActionService.browserBrowserActionApiAvailability(),
            tap(this.updateBadgeText),
        );
    }, { dispatch: false });

    public readonly onRemoveBadgeText$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(REMOVE_BADGE_TEXT),
            BrowserActionService.browserBrowserActionApiAvailability(),
            StorageService.browserStorageApiAvailability(),
            tap(this.removeBadgeText),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        store: Store<AppState>,
        storageService: StorageService,
        private readonly browserActionService: BrowserActionService,
    ) {
        super(store, storageService);
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }

    @Bind
    private updateBadgeText({ text }: { text: string }): void {
        this.browserActionService.setBadgeText({ text });
    }

    @Bind
    private removeBadgeText(): void {
        this.browserActionService.setBadgeText({ text: '' });
    }

    @Bind
    private loadNewScreenshotCounterFromStorage(): void {
        this.storageService.get(NEW_SCREENSHOT_COUNT_STORAGE_KEY, (items) => {
            if (items && !Number.isNaN(+items[NEW_SCREENSHOT_COUNT_STORAGE_KEY])) {
                this.store.dispatch(SET_NEW_SCREENSHOT_COUNT({ newScreenshotCount: items[NEW_SCREENSHOT_COUNT_STORAGE_KEY] }));
            }
        });
    }
}
