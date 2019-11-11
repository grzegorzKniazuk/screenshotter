import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NewScreenshotComponent } from 'src/app/views/dashboard/new-screenshot/new-screenshot.component';
import { ScreenshotGalleryComponent } from 'src/app/views/dashboard/screenshot-gallery/screenshot-gallery.component';
import { SettingsComponent } from 'src/app/views/dashboard/settings/settings.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { RESET_NEW_SCREENSHOT_COUNT } from 'src/app/store/actions';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

    constructor(
        private readonly store: Store<AppState>,
    ) {
    }

    public onRouteActivate(activatedComponent: NewScreenshotComponent | ScreenshotGalleryComponent | SettingsComponent): void {
        if (activatedComponent instanceof ScreenshotGalleryComponent) {
            this.store.dispatch(RESET_NEW_SCREENSHOT_COUNT());
        }
    }
}
