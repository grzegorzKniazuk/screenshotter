import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { selectNewScreenshotCounter } from 'src/app/store/selectors';

@Component({
    selector: 'app-dashboard-nav',
    templateUrl: './dashboard-nav.component.html',
    styleUrls: [ './dashboard-nav.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavComponent {

    public readonly newScreenshotCounter$ = this.store.pipe(select(selectNewScreenshotCounter));

    constructor(
        private readonly store: Store<AppState>,
    ) {
    }
}
