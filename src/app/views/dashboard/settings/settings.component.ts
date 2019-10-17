import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: [ './settings.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
}
