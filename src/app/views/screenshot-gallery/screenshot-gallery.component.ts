import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { Image } from 'src/app/interfaces/image';
import { selectRecipes } from 'src/app/store/image.selectors';

@Component({
    selector: 'app-screenshot-gallery',
    templateUrl: './screenshot-gallery.component.html',
    styleUrls: [ './screenshot-gallery.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotGalleryComponent {

    public readonly images$: Observable<Image[]> = this.store.pipe(select(selectRecipes));

    constructor(
        private readonly store: Store<AppState>,
    ) {
    }
}
