import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MAKE_SCREENSHOT } from 'src/app/store/actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';

@Component({
    selector: 'app-new-screenshot',
    templateUrl: './new-screenshot.component.html',
    styleUrls: [ './new-screenshot.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewScreenshotComponent {

    constructor(
        private readonly store: Store<AppState>,
    ) {
    }

    public makeScreenshot(): void {
        this.store.dispatch(MAKE_SCREENSHOT());
    }
}
