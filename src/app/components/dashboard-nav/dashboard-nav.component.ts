import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { MAKE_SCREENSHOT } from 'src/app/store/images.actions';

@Component({
    selector: 'app-dashboard-nav',
    templateUrl: './dashboard-nav.component.html',
    styleUrls: [ './dashboard-nav.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavComponent {

    constructor(
        private readonly store: Store<AppState>,
    ) {}

    public makeScreenshot(): void {
        this.store.dispatch(MAKE_SCREENSHOT);
    }
}
