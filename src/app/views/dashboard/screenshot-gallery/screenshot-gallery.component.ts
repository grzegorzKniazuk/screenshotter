import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { DELETE_SCREENSHOT, DOWNLOAD_SCREENSHOT, OPEN_SOURCE, PREVIEW_SCREENSHOT, UPDATE_SCREENSHOT } from 'src/app/store/actions';
import { DownloadScreenshotDto } from 'src/app/dto';
import { ToastService } from 'src/app/services';
import { selectScreenshots, selectScreenshotsByQuery } from 'src/app/store/selectors';
import { Update } from '@ngrx/entity';

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
        this.store.dispatch(OPEN_SOURCE({ url }));
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

    public onUpdate(screenshotUpdateDto: Update<Screenshot>): void {
        this.store.dispatch(UPDATE_SCREENSHOT({ screenshot: screenshotUpdateDto }));
    }

    public trackScreenshotById(index: number, item: Screenshot): string {
        if (!index) {
            return null;
        } else {
            return item.id;
        }
    }
}
