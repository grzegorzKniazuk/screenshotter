import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { selectScreenshots, selectTotalScreenshots } from 'src/app/store/selectors';
import { DELETE_SCREENSHOT, OPEN_SOURCE } from 'src/app/store/actions';

@Component({
    selector: 'app-screenshot-gallery',
    templateUrl: './screenshot-gallery.component.html',
    styleUrls: [ './screenshot-gallery.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotGalleryComponent {

    public readonly images$: Observable<Screenshot[]> = this.store.pipe(select(selectScreenshots));
    public readonly totalImages$: Observable<number> = this.store.pipe(select(selectTotalScreenshots));

    constructor(
        private readonly store: Store<AppState>,
    ) {
    }

    public onScreenshotDelete(id: string): void {
        this.store.dispatch(DELETE_SCREENSHOT({ id }));
    }

    public onOpenSource(url: string): void {
        this.store.dispatch(OPEN_SOURCE({ url }));
    }
}
