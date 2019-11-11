import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { BaseEffects } from 'src/app/store/effects/base.effects';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AppState } from 'src/app/store/index';
import { BrowserActionService, StorageService, TabsService } from 'src/app/services';
import { tap } from 'rxjs/operators';
import { OPEN_BROWSER_TAB, REMOVE_BADGE_TEXT, SET_BADGE_TEXT, SET_NEW_SCREENSHOT_COUNT } from 'src/app/store/actions';
import { Bind } from 'src/app/decorators';
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

    public readonly onOpenBrowserTab$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(OPEN_BROWSER_TAB),
            TabsService.browserTabsApiAvailability(),
            tap(this.openExternalTab),
        );
    }, { dispatch: false });

    constructor(
        protected readonly actions$: Actions,
        store: Store<AppState>,
        storageService: StorageService,
        private readonly browserActionService: BrowserActionService,
        private readonly tabsService: TabsService,
        protected readonly ngZone: NgZone,
        applicationRef: ApplicationRef,
    ) {
        super(store, storageService, applicationRef);
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }

    @Bind
    public openExternalTab({ url }: { url: string }): void {
        this.tabsService.create({ url }, this.tick);
    }

    @Bind
    private updateBadgeText({ text }: { text: string }): void {
        this.browserActionService.setBadgeText({ text }, this.tick);
    }

    @Bind
    private removeBadgeText(): void {
        this.browserActionService.setBadgeText({ text: '' }, this.tick);
    }

    @Bind
    private loadNewScreenshotCounterFromStorage(): void {
        this.storageService.get(NEW_SCREENSHOT_COUNT_STORAGE_KEY, (items) => {
            this.ngZone.run(() => {
                if (items && !Number.isNaN(+items[NEW_SCREENSHOT_COUNT_STORAGE_KEY])) {
                    this.store.dispatch(SET_NEW_SCREENSHOT_COUNT({ newScreenshotCount: items[NEW_SCREENSHOT_COUNT_STORAGE_KEY] }));
                }
            });
        });
    }
}
