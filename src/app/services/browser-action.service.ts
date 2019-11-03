import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import BadgeTextDetails = chrome.browserAction.BadgeTextDetails;

@Injectable({
    providedIn: 'root',
})
export class BrowserActionService extends ApiService {

    public static browserBrowserActionApiAvailability(): (source$: Observable<any>) => Observable<any> {
        return ApiService.browserApiAvailability('browserAction');
    }

    public setBadgeText(details: BadgeTextDetails, callback?: () => void): void {
        this.chrome.browserAction.setBadgeText(details, callback);
    }
}
