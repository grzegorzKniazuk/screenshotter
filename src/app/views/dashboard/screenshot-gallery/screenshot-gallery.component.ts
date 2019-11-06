import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { ADD_TO_FAVORITES, DELETE_SCREENSHOT, DOWNLOAD_SCREENSHOT, OPEN_SCREENSHOT_SOURCE, PREVIEW_SCREENSHOT, REMOVE_FROM_FAVORITES } from 'src/app/store/actions';
import { DownloadScreenshotDto, FavoriteScreenshotDto } from 'src/app/dto';
import { ToastService } from 'src/app/services';
import { selectScreenshots, selectScreenshotsByQuery } from 'src/app/store/selectors';

@Component({
    selector: 'app-screenshot-gallery',
    templateUrl: './screenshot-gallery.component.html',
    styleUrls: [ './screenshot-gallery.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotGalleryComponent {

    public images$: Observable<Screenshot[]> = this.store.pipe(select(selectScreenshots));

    constructor(
        private readonly store: Store<AppState>,
        private readonly toastService: ToastService,
    ) {
    }

    public onDelete(id: string): void {
        this.toastService.question('Are You sure want to delete this screenshot?').subscribe(() => {
            this.store.dispatch(DELETE_SCREENSHOT({ id }));
        });
    }

    public onOpen(url: string): void {
        this.store.dispatch(OPEN_SCREENSHOT_SOURCE({ url }));
    }

    public onDownload(downloadScreenshotDto: DownloadScreenshotDto): void {
        this.store.dispatch(DOWNLOAD_SCREENSHOT(downloadScreenshotDto));
    }

    public onSearch(query: string): void {
        this.images$ = this.store.pipe(select(selectScreenshotsByQuery, { title: query }));
    }

    public onPreview(data: string): void {
        this.store.dispatch(PREVIEW_SCREENSHOT({ data }));
    }

    public onFavorite({ id, favorite }: FavoriteScreenshotDto): void {
        if (favorite) {
            this.store.dispatch(REMOVE_FROM_FAVORITES({ id }));
        } else {
            this.store.dispatch(ADD_TO_FAVORITES({ id }));
        }
    }

    public trackScreenshotById(index: number, item: Screenshot): string {
        if (!index) {
            return null;
        } else {
            return item.id;
        }
    }
}
