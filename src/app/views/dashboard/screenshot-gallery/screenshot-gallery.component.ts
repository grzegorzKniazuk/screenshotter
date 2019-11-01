import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { DELETE_SCREENSHOT, DOWNLOAD_SCREENSHOT, OPEN_SOURCE, RESET_NEW_SCREENSHOT_COUNT } from 'src/app/store/actions';
import { DownloadScreenshotDto } from 'src/app/dto';
import { ToastService } from 'src/app/services';
import { selectScreenshots } from 'src/app/store/selectors';

@Component({
    selector: 'app-screenshot-gallery',
    templateUrl: './screenshot-gallery.component.html',
    styleUrls: [ './screenshot-gallery.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotGalleryComponent implements OnInit {

    public readonly images$: Observable<Screenshot[]> = this.store.pipe(select(selectScreenshots));

    constructor(
        private readonly store: Store<AppState>,
        private readonly toastService: ToastService,
    ) {
    }

    ngOnInit() {
        this.store.dispatch(RESET_NEW_SCREENSHOT_COUNT());
    }

    public onDelete(id: string): void {
        this.toastService.question('Are You sure want to delete this screenshot?').subscribe(() => {
            this.store.dispatch(DELETE_SCREENSHOT({ id }));
        });
    }

    public onOpen(url: string): void {
        this.store.dispatch(OPEN_SOURCE({ url }));
    }

    public onDownload({ data, filename }: DownloadScreenshotDto): void {
        this.store.dispatch(DOWNLOAD_SCREENSHOT({ data, filename }));
    }
}
