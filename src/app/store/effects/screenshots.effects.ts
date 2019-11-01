import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import {
    ADD_SCREENSHOT,
    ADD_SCREENSHOTS,
    CLEAR_SCREENSHOTS_STORAGE,
    DELETE_SCREENSHOT,
    DOWNLOAD_SCREENSHOT,
    INCREASE_NEW_SCREENSHOT_COUNT,
    MAKE_SCREENSHOT,
    OPEN_SOURCE,
} from 'src/app/store/actions';
import { tap, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { AppState } from 'src/app/store/index';
import { Screenshot, Settings } from 'src/app/interfaces';
import { DownloadsService, StorageService, TabsService, ToastService } from 'src/app/services';
import { SCREENSHOTS_STORAGE_KEY } from 'src/app/constants';
import { selectAutoDownloadState, selectScreenshots, selectSettingsState } from 'src/app/store/selectors';
import { FileFormat } from 'src/app/enums';
import { DownloadScreenshotDto } from 'src/app/dto';
import { Bind } from 'lodash-decorators';
import { BaseEffects } from 'src/app/store/effects/base.effects';
import Tab = chrome.tabs.Tab;

@Injectable()
export class ScreenshotsEffects extends BaseEffects implements OnInitEffects {

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
            withLatestFrom(this.store.pipe(select(selectSettingsState))),
            tap(([ , { fileFormat, fileQuality }]: [ Action, Settings ]) => {
                this.tabsService.query(({ active: true }), (tabs: Tab[]) => {
                    const { title, url } = tabs.find((tab: Tab) => tab.active);

                    this.tabsService.captureVisibleTab({ format: fileFormat, quality: fileQuality }, (dataUrl: string) => {
                        this.store.dispatch(ADD_SCREENSHOT({
                            screenshot: {
                                id: uuid(),
                                data: dataUrl,
                                time: new Date().toISOString(),
                                title,
                                url,
                                size: this.dataUrlToBytes(dataUrl),
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
            withLatestFrom(this.store.pipe(select(selectAutoDownloadState)), this.store.pipe(select(selectScreenshots))),
            tap(([ { screenshot }, autoDownloadState ]: [ { screenshot: Screenshot }, boolean, Screenshot[] ]) => {
                if (autoDownloadState) {
                    this.store.dispatch(DOWNLOAD_SCREENSHOT(ScreenshotsEffects.createDownloadScreenshotDto(screenshot)));
                }
            }),
            tap(([ , , screenshots ]: [ { screenshot: Screenshot }, boolean, Screenshot[] ]) => this.storageService.set({ [SCREENSHOTS_STORAGE_KEY]: screenshots })),
            tap(this.notifySuccessfulAdd),
            tap(this.increaseNewScreenshotCounter),
            tap(this.updateBytesInUse),
        );
    }, { dispatch: false });

    public readonly onDeleteScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DELETE_SCREENSHOT),
            StorageService.browserStorageApiAvailability(),
            withLatestFrom(this.store.pipe(select(selectScreenshots))),
            tap(([ , screenshots ]: [ Action, Screenshot[] ]) => this.storageService.set({ [SCREENSHOTS_STORAGE_KEY]: screenshots })),
            tap(this.notifySuccessfulDelete),
            tap(this.updateBytesInUse),
        );
    }, { dispatch: false });

    public readonly onOpenSource$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(OPEN_SOURCE),
            TabsService.browserTabsApiAvailability(),
            tap(this.openScreenshotSource),
        );
    }, { dispatch: false });

    public readonly onDownloadScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DOWNLOAD_SCREENSHOT),
            DownloadsService.browserDownloadsApiAvailability(),
            withLatestFrom(this.store.pipe(select(selectSettingsState))),
            tap(this.downloadScreenshot),
            tap(this.notifySuccessfulDownload),
        );
    }, { dispatch: false });

    public readonly onClearScreenshotsStorage = createEffect(() => {
        return this.actions$.pipe(
            ofType(CLEAR_SCREENSHOTS_STORAGE),
            StorageService.browserStorageApiAvailability(),
            tap(this.clearStorage),
            tap(this.notifySuccessfulClear),
            tap(this.updateBytesInUse),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        store: Store<AppState>,
        storageService: StorageService,
        private readonly tabsService: TabsService,
        private readonly downloadsService: DownloadsService,
        private readonly toastService: ToastService,
    ) {
        super(store, storageService);
    }

    public static createDownloadScreenshotDto(screenshot: Screenshot): DownloadScreenshotDto {
        return ({ data: screenshot.data, filename: `${screenshot.id}.${screenshot.format}` });
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }

    private dataUrlToBytes(dataUrl: string): number {
        return window.atob(dataUrl.split(',')[1]).length;
    }

    @Bind
    private openScreenshotSource({ url }: { url: string }): void {
        this.tabsService.create({ url });
    }

    @Bind
    private downloadScreenshot([ { data, filename }, { conflictAction, alwaysShowSaveAs } ]: [ DownloadScreenshotDto, Settings ]): void {
        this.downloadsService.download({ url: data, filename, conflictAction, saveAs: alwaysShowSaveAs });
    }

    @Bind
    private increaseNewScreenshotCounter(): void {
        this.store.dispatch(INCREASE_NEW_SCREENSHOT_COUNT());
    }

    @Bind
    private notifySuccessfulDownload(): void {
        this.toastService.success('Screenshot has been downloaded');
    }

    @Bind
    private notifySuccessfulAdd(): void {
        this.toastService.success('Screenshot has been saved');
    }

    @Bind
    private notifySuccessfulDelete(): void {
        this.toastService.success('Screenshot has been deleted');
    }

    @Bind notifySuccessfulClear(): void {
        this.toastService.success('Screenshots have been removed');
    }

    @Bind
    private clearStorage(): void {
        this.storageService.remove(SCREENSHOTS_STORAGE_KEY);
    }
}
