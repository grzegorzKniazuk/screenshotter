import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { Image } from 'src/app/interfaces/image';
import { selectImages, selectTotalImages } from 'src/app/store/image.selectors';
import { DELETE_SCREENSHOT } from 'src/app/store/images.actions';

@Component({
    selector: 'app-screenshot-gallery',
    templateUrl: './screenshot-gallery.component.html',
    styleUrls: [ './screenshot-gallery.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotGalleryComponent {

    public readonly images$: Observable<Image[]> = this.store.pipe(select(selectImages));
    public readonly totalImages$: Observable<number> = this.store.pipe(select(selectTotalImages));

    constructor(
        private readonly store: Store<AppState>,
    ) {
    }

    public onScreenshotDelete(id: string): void {
        this.store.dispatch(DELETE_SCREENSHOT({ id }));
    }
}
