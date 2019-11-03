import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

    ngOnInit() {
        this.connectToBackgroundScript();
    }

    private connectToBackgroundScript() {
        if (chrome && chrome.runtime) {
            chrome.runtime.connect({
                name: 'screenshoter',
            });
        }
    }
}
