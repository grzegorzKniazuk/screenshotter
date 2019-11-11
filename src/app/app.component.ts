import { Component, NgZone, OnInit } from '@angular/core';
import { ADD_SCREENSHOT, INCREASE_NEW_SCREENSHOT_COUNT, LOAD_SCREENSHOTS, REMOVE_BADGE_TEXT } from 'src/app/store/actions';
import { AppState } from 'src/app/store';
import { select, Store } from '@ngrx/store';
import { selectUrl } from './store/selectors';
import { first } from 'rxjs/operators';
import { RoutesUrls } from 'src/app/enums';
import { Bind } from 'lodash-decorators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {

    constructor(
        private readonly store: Store<AppState>,
        private readonly ngZone: NgZone,
    ) {
    }

    ngOnInit() {
        this.connectToBackgroundScript();
    }

    private connectToBackgroundScript() {
        if (chrome && chrome.runtime) {
            const port = chrome.runtime.connect({
                name: 'screenshoter',
            });

            port.onMessage.addListener(this.onReceiveMessage);
        }
    }

    @Bind
    private onReceiveMessage(message: { type: string }): void {
        this.ngZone.run(() => {
            if (message.type === ADD_SCREENSHOT.type) {
                this.store.dispatch(LOAD_SCREENSHOTS());

                this.store.pipe(select(selectUrl), first()).subscribe((url: string) => {
                    if (!url.endsWith(RoutesUrls.GALLERY)) {
                        this.store.dispatch(INCREASE_NEW_SCREENSHOT_COUNT());
                    } else {
                        this.store.dispatch(REMOVE_BADGE_TEXT());
                    }
                });
            }
        });
    }
}
