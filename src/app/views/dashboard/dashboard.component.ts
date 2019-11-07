import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NewScreenshotComponent } from 'src/app/views/dashboard/new-screenshot/new-screenshot.component';
import { ScreenshotGalleryComponent } from 'src/app/views/dashboard/screenshot-gallery/screenshot-gallery.component';
import { SettingsComponent } from 'src/app/views/dashboard/settings/settings.component';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { INCREASE_NEW_SCREENSHOT_COUNT, RESET_NEW_SCREENSHOT_COUNT } from 'src/app/store/actions';
import { CommandsService } from 'src/app/services';
import { CAPTURE_NEW_SCREENSHOT_COMMAND } from 'src/app/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

    constructor(
        private readonly store: Store<AppState>,
        private readonly commandsService: CommandsService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        if (this.commandsService.browserCommandsApiAvailability) {
            this.commandsService.onCommand((command) => {
                switch (command) {
                    case CAPTURE_NEW_SCREENSHOT_COMMAND: {
                        if (!(this.activatedRoute.snapshot.component instanceof ScreenshotGalleryComponent)) {
                            this.store.dispatch(INCREASE_NEW_SCREENSHOT_COUNT());
                        }

                        break;
                    }
                }
            });
        }

    }

    public onRouteActivate(activatedComponent: NewScreenshotComponent | ScreenshotGalleryComponent | SettingsComponent): void {
        if (activatedComponent instanceof ScreenshotGalleryComponent) {
            this.store.dispatch(RESET_NEW_SCREENSHOT_COUNT());
        }
    }
}
