import { Component, OnInit } from '@angular/core';
import { MAKE_SCREENSHOT } from 'src/app/store/images.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';

@Component({
    selector: 'app-new-screenshot',
    templateUrl: './new-screenshot.component.html',
    styleUrls: [ './new-screenshot.component.scss', '../dashboard.component.scss' ],
})
export class NewScreenshotComponent implements OnInit {

    constructor(
        private readonly store: Store<AppState>,
    ) {
    }

    ngOnInit() {
    }

    public makeScreenshot(): void {
        this.store.dispatch(MAKE_SCREENSHOT());
    }
}
