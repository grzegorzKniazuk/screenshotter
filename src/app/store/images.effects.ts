import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { ADD_SCREENSHOT, ADD_SCREENSHOTS, DELETE_SCREENSHOT, MAKE_SCREENSHOT } from 'src/app/store/images.actions';
import { map, tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import {} from 'chrome';
import { AppState } from 'src/app/store/index';
import { browserStorageApiAvailability, browserTabsApiAvailability } from 'src/app/operators';
import { Image } from 'src/app/interfaces/image';
import Tab = chrome.tabs.Tab;

@Injectable()
export class ImagesEffects implements OnInitEffects {

    public readonly init$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ROOT_EFFECTS_INIT),
            browserStorageApiAvailability(),
            tap(() => {
                chrome.storage.local.get(null, (images: { [key: string]: Image }) => {
                    this.store.dispatch(ADD_SCREENSHOTS({ images: [ ...Object.values(images) ] }));
                });
            }),
        );
    }, { dispatch: false });

    public readonly onMakeScreenshot = createEffect(() => {
        return this.actions$.pipe(
            ofType(MAKE_SCREENSHOT),
            browserTabsApiAvailability(),
            map(() => {
                console.log(chrome.tabs);
                chrome.tabs.query(({ active: true }), (tabs: Tab[]) => {
                    const { title, url } = tabs.find((tab: Tab) => tab.active);

                    chrome.tabs.captureVisibleTab((dataUrl: string) => {
                        this.store.dispatch(ADD_SCREENSHOT({ image: { id: uuid(), src: dataUrl, time: '', title, url, page: ''} }));
                    });
                });
            }),
        );
    }, { dispatch: false });

    public readonly onAddScreenshot = createEffect(() => {
        return this.actions$.pipe(
            ofType(ADD_SCREENSHOT),
            browserStorageApiAvailability(),
            tap(({ image }: { image: Image }) => chrome.storage.local.set({ [image.id]: image })),
        );
    }, { dispatch: false });

    public readonly onDeleteScreenshot = createEffect(() => {
        return this.actions$.pipe(
            ofType(DELETE_SCREENSHOT),
            browserStorageApiAvailability(),
            tap(({ id }: { id: string }) => chrome.storage.local.remove(id)),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<AppState>) {
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }
}
