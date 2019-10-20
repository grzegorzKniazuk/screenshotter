import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import {
    ADD_SCREENSHOT,
    ADD_SCREENSHOTS,
    DELETE_SCREENSHOT,
    DOWNLOAD_SCREENSHOT,
    MAKE_SCREENSHOT,
    OPEN_SOURCE,
} from 'src/app/store/actions';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { AppState } from 'src/app/store/index';
import { Screenshot, Settings } from 'src/app/interfaces';
import { StorageService, TabsService } from 'src/app/services';
import { SCREENSHOTS_STORAGE_KEY } from 'src/app/constants';
import { selectAutoDownloadState, selectScreenshots, selectSettingsState } from 'src/app/store/selectors';
import { FileFormat } from 'src/app/enums';
import { DownloadsService } from 'src/app/services/downloads.service';
import { DownloadScreenshotDto } from 'src/app/dto';
import Tab = chrome.tabs.Tab;
import { TimeService } from 'src/app/services/time.service';

@Injectable()
export class ScreenshotsEffects implements OnInitEffects {

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<AppState>,
        private readonly storageService: StorageService,
        private readonly tabsService: TabsService,
        private readonly downloadsService: DownloadsService,
    ) {
    }

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
                                data: dataUrl,
                                time: TimeService.byFormat('DD-MM-YYYY kk:mm'),
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
            withLatestFrom(this.store.pipe(select(selectAutoDownloadState))),
            tap(([ { screenshot }, autoDownloadState ]: [ { screenshot: Screenshot, action: Action }, boolean ]) => {
                if (autoDownloadState) {
                    this.store.dispatch(DOWNLOAD_SCREENSHOT(ScreenshotsEffects.createDownloadScreenshotDto(screenshot)));
                }
            }),
            switchMap(() => this.store.pipe(select(selectScreenshots))),
            tap((screenshots: Screenshot[]) => this.storageService.set({ [SCREENSHOTS_STORAGE_KEY]: screenshots })),
        );
    }, { dispatch: false });

    public readonly onDeleteScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DELETE_SCREENSHOT),
            StorageService.browserStorageApiAvailability(),
            switchMap(() => this.store.pipe(select(selectScreenshots))),
            tap((screenshots: Screenshot[]) => this.storageService.set({ [SCREENSHOTS_STORAGE_KEY]: screenshots })),
        );
    }, { dispatch: false });

    public readonly onOpenSource$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(OPEN_SOURCE),
            TabsService.browserTabsApiAvailability(),
            tap(({ url }: { url: string }) => this.tabsService.create({ url })),
        );
    }, { dispatch: false });

    public readonly onDownloadScreenshot$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(DOWNLOAD_SCREENSHOT),
            DownloadsService.browserDownloadsApiAvailability(),
            withLatestFrom(this.store.pipe(select(selectSettingsState))),
            tap(([ { data, filename }, { conflictAction, alwaysShowSaveAs } ]: [ DownloadScreenshotDto, Settings ]) => {
                this.downloadsService.download({ url: data, filename, conflictAction, saveAs: alwaysShowSaveAs });
            }),
        );
    }, { dispatch: false });

    public static createDownloadScreenshotDto(screenshot: Screenshot): DownloadScreenshotDto {
        return ({ data: screenshot.data, filename: `${screenshot.title}.${screenshot.format}` });
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }

    private dataUrlToBytes(dataUrl: string): number {
        return window.atob(dataUrl.split(',')[1]).length;
    }
}
