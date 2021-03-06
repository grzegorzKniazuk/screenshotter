import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import {
    ADD_SCREENSHOT,
    ADD_TO_FAVORITES,
    CLEAR_SCREENSHOTS_STORAGE,
    DELETE_SCREENSHOT,
    DOWNLOAD_SCREENSHOT,
    INCREASE_NEW_SCREENSHOT_COUNT,
    LOAD_SCREENSHOTS,
    MAKE_SCREENSHOT,
    OPEN_BROWSER_TAB,
    OPEN_SCREENSHOT_SOURCE,
    PREVIEW_SCREENSHOT,
    REMOVE_BADGE_TEXT,
    REMOVE_FROM_FAVORITES,
    RESET_NEW_SCREENSHOT_COUNT,
    SET_BADGE_TEXT,
    SET_SCREENSHOTS,
} from 'src/app/store/actions';
import { first, map, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import { AppState } from 'src/app/store/index';
import { Screenshot, Settings } from 'src/app/interfaces';
import { DownloadsService, StorageService, TabsService, ToastService } from 'src/app/services';
import { SCREENSHOTS_STORAGE_KEY } from 'src/app/constants';
import { selectAutoDownloadState, selectNewScreenshotCounter, selectScreenshots, selectSettingsState } from 'src/app/store/selectors';
import { FileFormat } from 'src/app/enums';
import { DownloadScreenshotDto } from 'src/app/dto';
import { Bind } from 'src/app/decorators';
import { BaseEffects } from 'src/app/store/effects/base.effects';
import Tab = chrome.tabs.Tab;

@Injectable()
export class ScreenshotsEffects extends BaseEffects implements OnInitEffects {

    public readonly init$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ROOT_EFFECTS_INIT),
            map(() => LOAD_SCREENSHOTS()),
        );
    });

    public readonly loadScreenshots$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(LOAD_SCREENSHOTS),
            StorageService.browserStorageApiAvailability(),
            tap(this.loadScreenshotsFromStorage),
        );
    }, { dispatch: false });

    public readonly onMakeScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(MAKE_SCREENSHOT),
            TabsService.browserTabsApiAvailability(),
            switchMapTo(this.store.pipe(select(selectSettingsState), first())),
            tap(this.captureVisibleTab),
        );
    }, { dispatch: false });

    public readonly onAddScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ADD_SCREENSHOT),
            StorageService.browserStorageApiAvailability(),
            withLatestFrom(this.store.pipe(select(selectAutoDownloadState))),
            tap(this.downloadScreenshotOnEnabledAutoDownloadOption),
            switchMapTo(this.store.pipe(select(selectScreenshots), first())),
            tap(this.updateLocalScreenshotsStorage),
            tap(this.notifySuccessSave),
            tap(this.updateBytesInUse),
            map(() => INCREASE_NEW_SCREENSHOT_COUNT()),
        );
    });

    public readonly onFavoriteToggle$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES),
            StorageService.browserStorageApiAvailability(),
            tap(this.notifyFavoritesToggle),
            switchMapTo(this.store.pipe(select(selectScreenshots), first())),
            tap(this.updateLocalScreenshotsStorage),
        );
    }, { dispatch: false });

    public readonly onDeleteScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DELETE_SCREENSHOT),
            StorageService.browserStorageApiAvailability(),
            switchMapTo(this.store.pipe(select(selectScreenshots), first())),
            tap(this.updateLocalScreenshotsStorage),
            tap(this.notifySuccessDelete),
            tap(this.updateBytesInUse),
        );
    }, { dispatch: false });

    public readonly onOpenSource$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(OPEN_SCREENSHOT_SOURCE),
            TabsService.browserTabsApiAvailability(),
            map(({ url }) => OPEN_BROWSER_TAB({ url })),
        );
    });

    public readonly onDownloadScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DOWNLOAD_SCREENSHOT),
            DownloadsService.browserDownloadsApiAvailability(),
            withLatestFrom(this.store.pipe(select(selectSettingsState))),
            tap(this.downloadScreenshot),
            tap(this.notifySuccessDownload),
        );
    }, { dispatch: false });

    public readonly onClearScreenshotsStorage$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(CLEAR_SCREENSHOTS_STORAGE),
            StorageService.browserStorageApiAvailability(),
            tap(this.clearScreenshotsStorage),
            tap(this.notifySuccessStorageClear),
            tap(this.updateBytesInUse),
        );
    }, { dispatch: false });

    public readonly onIncreaseNewScreenshotCount$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(INCREASE_NEW_SCREENSHOT_COUNT),
            StorageService.browserStorageApiAvailability(),
            switchMapTo(this.store.pipe(select(selectNewScreenshotCounter), first())),
            map((newScreenshotCounter: number) => SET_BADGE_TEXT({ text: `${newScreenshotCounter}` })),
        );
    });

    public readonly onResetNewScreenshotCount$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RESET_NEW_SCREENSHOT_COUNT),
            map(() => REMOVE_BADGE_TEXT()),
        );
    });

    public readonly onPreviewScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(PREVIEW_SCREENSHOT),
            TabsService.browserTabsApiAvailability(),
            map(({ data }: { data: string }) => OPEN_BROWSER_TAB({ url: data })),
        );
    });

    constructor(
        protected readonly actions$: Actions,
        store: Store<AppState>,
        storageService: StorageService,
        private readonly tabsService: TabsService,
        private readonly downloadsService: DownloadsService,
        private readonly toastService: ToastService,
        protected readonly ngZone: NgZone,
        applicationRef: ApplicationRef,
    ) {
        super(store, storageService, applicationRef);
    }

    public static createDownloadScreenshotDto(screenshot: Screenshot): DownloadScreenshotDto {
        return ({ data: screenshot.data, filename: `${screenshot.id}.${screenshot.format}` });
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }

    @Bind
    private loadScreenshotsFromStorage(): void {
        this.storageService.get(SCREENSHOTS_STORAGE_KEY, (items) => {
            this.ngZone.run(() => {
                if (items && Array.isArray(items[SCREENSHOTS_STORAGE_KEY])) {
                    this.store.dispatch(SET_SCREENSHOTS({ screenshots: items[SCREENSHOTS_STORAGE_KEY] }));
                }
            });
        });
    }

    @Bind
    private captureVisibleTab({ fileFormat, fileQuality }: Settings): void {
        this.tabsService.query(({ active: true }), (tabs: Tab[]) => {
            const { title, url } = tabs.find((tab: Tab) => tab.active);

            this.tabsService.captureVisibleTab({ format: fileFormat, quality: fileQuality }, (dataUrl: string) => {
                this.ngZone.run(() => {
                    this.store.dispatch(ADD_SCREENSHOT({
                        screenshot: {
                            id: this.uuid(),
                            data: dataUrl,
                            time: new Date().toISOString(),
                            title,
                            url,
                            size: this.dataUrlToBytes(dataUrl),
                            format: fileFormat,
                            quality: fileFormat === FileFormat.JPEG ? fileQuality : 100,
                            favorite: false,
                        },
                    }));
                });
            });
        });
    }

    @Bind
    private downloadScreenshotOnEnabledAutoDownloadOption([ { screenshot }, autoDownloadState ]: [ { screenshot: Screenshot }, boolean ]): void {
        if (autoDownloadState) {
            this.store.dispatch(DOWNLOAD_SCREENSHOT(ScreenshotsEffects.createDownloadScreenshotDto(screenshot)));
        }
    }

    private dataUrlToBytes(dataUrl: string): number {
        return window.atob(dataUrl.split(',')[1]).length;
    }

    @Bind
    private downloadScreenshot([ { data, filename }, { conflictAction, alwaysShowSaveAs } ]: [ DownloadScreenshotDto, Settings ]): void {
        this.downloadsService.download({ url: data, filename, conflictAction, saveAs: alwaysShowSaveAs }, this.tick);
    }

    @Bind
    private notifySuccessStorageClear(): void {
        this.toastService.success('Screenshots have been removed');
    }

    @Bind
    private notifySuccessDownload(): void {
        this.toastService.success('Screenshot has been downloaded');
    }

    @Bind
    private notifySuccessDelete(): void {
        this.toastService.success('Screenshot has been deleted');
    }

    @Bind
    private notifySuccessSave(): void {
        this.toastService.success('Screenshot has been saved');
    }

    @Bind
    private notifyFavoritesToggle({ type }: Action): void {
        if (type === ADD_TO_FAVORITES.type) {
            this.toastService.success('Screenshot added to favorites');
        } else {
            this.toastService.success('Screenshot removed from favorites');
        }
    }

    @Bind
    private updateLocalScreenshotsStorage(screenshots: Screenshot[]): void {
        this.storageService.set({ [SCREENSHOTS_STORAGE_KEY]: screenshots }, this.tick);
    }

    @Bind
    private clearScreenshotsStorage(): void {
        this.storageService.remove(SCREENSHOTS_STORAGE_KEY, this.tick);
    }

    private uuid() {
        let dt = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}
