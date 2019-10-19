import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { ADD_SCREENSHOT, ADD_SCREENSHOTS, DELETE_SCREENSHOT, MAKE_SCREENSHOT, OPEN_SOURCE } from 'src/app/store/actions';
import { switchMap, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { AppState } from 'src/app/store/index';
import { Screenshot, Settings } from 'src/app/interfaces';
import Tab = chrome.tabs.Tab;
import { StorageService, TabsService } from 'src/app/services';
import { SCREENSHOTS_STORAGE_KEY } from 'src/app/constants';
import { selectScreenshots, selectSettingsState } from 'src/app/store/selectors';
import { FileFormat } from 'src/app/enums';

@Injectable()
export class ScreenshotsEffects implements OnInitEffects {

    public readonly init$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ROOT_EFFECTS_INIT),
            StorageService.browserStorageApiAvailability(),
            tap(() => {
                this.storageService.get(SCREENSHOTS_STORAGE_KEY, (screenshots: { [key: string]: Screenshot[] }) => {
                    this.store.dispatch(ADD_SCREENSHOTS({ screenshots: screenshots[SCREENSHOTS_STORAGE_KEY] }));
                });
            }),
        );
    }, { dispatch: false });

    public readonly onMakeScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(MAKE_SCREENSHOT),
            TabsService.browserTabsApiAvailability(),
            switchMap(() => this.store.pipe(select(selectSettingsState))),
            tap(({ fileFormat, fileQuality }: Settings) => {
                this.tabsService.query(({ active: true }), (tabs: Tab[]) => {
                    const { title, url } = tabs.find((tab: Tab) => tab.active);

                    this.tabsService.captureVisibleTab({ format: fileFormat, quality: fileQuality }, (dataUrl: string) => {
                        this.store.dispatch(ADD_SCREENSHOT({
                            screenshot: {
                                id: uuid(),
                                src: dataUrl,
                                time: '',
                                title,
                                url,
                                size: window.atob(dataUrl.split(',')[1]).length,
                                format: fileFormat,
                                quality: fileFormat === FileFormat.JPEG ? fileQuality : 100,
                            },
                        }));
                    });
                });
            }),
        );
    }, { dispatch: false });

    public readonly onAddScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ADD_SCREENSHOT),
            StorageService.browserStorageApiAvailability(),
            switchMap(() => this.store.pipe(select(selectScreenshots))),
            tap((screenshots: Screenshot[]) => this.storageService.set({ [SCREENSHOTS_STORAGE_KEY]: screenshots })),
        );
    }, { dispatch: false });

    public readonly onDeleteScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DELETE_SCREENSHOT),
            StorageService.browserStorageApiAvailability(),
            tap(({ id }: { id: string }) => this.storageService.remove(id)),
        );
    }, { dispatch: false });

    public readonly onOpenSource$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(OPEN_SOURCE),
            TabsService.browserTabsApiAvailability(),
            tap(({ url }: { url: string }) => this.tabsService.create({ url })),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<AppState>,
        private readonly storageService: StorageService,
        private readonly tabsService: TabsService,
    ) {
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }
}
