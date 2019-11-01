import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { selectNewScreenshotCounter } from 'src/app/store/selectors';
import { filter, tap } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard-nav',
    templateUrl: './dashboard-nav.component.html',
    styleUrls: [ './dashboard-nav.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavComponent {

    public readonly newScreenshotCounter$: Observable<number> = this.store.pipe(
        select(selectNewScreenshotCounter),
        filter(() => !!this.changeDetectorRef),
        tap(() => this.changeDetectorRef.detectChanges()),
    );

    constructor(
        private readonly store: Store<AppState>,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
    }
}
