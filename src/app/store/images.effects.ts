import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { ADD_SCREENSHOT, MAKE_SCREENSHOT } from 'src/app/store/images.actions';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import {} from 'chrome';
import { AppState } from 'src/app/store/index';

@Injectable()
export class ImagesEffects implements OnInitEffects {

    public readonly onMakeScreenshot = createEffect(() => {
        return this.actions$.pipe(
            ofType(MAKE_SCREENSHOT),
            map(() => {
                chrome.tabs.captureVisibleTab((dataUrl: string) => {
                    this.store.dispatch(ADD_SCREENSHOT({ image: { id: uuid(), src: dataUrl, time: new Date(), name: '', page: '' } }));
                });
            }),
        );
    }, { dispatch: false });

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<AppState>,
    ) {
    }

    ngrxOnInitEffects(): Action {
        return { type: ROOT_EFFECTS_INIT };
    }
}
