import { ApiService } from 'src/app/services/api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import CaptureVisibleTabOptions = chrome.tabs.CaptureVisibleTabOptions;
import QueryInfo = chrome.tabs.QueryInfo;
import Tab = chrome.tabs.Tab;
import CreateProperties = chrome.tabs.CreateProperties;

@Injectable({
    providedIn: 'root',
})
export class TabsService extends ApiService {

    public static browserTabsApiAvailability(): (source$: Observable<any>) => Observable<any> {
        return ApiService.browserApiAvailability('tabs');
    }

    public captureVisibleTab(options: CaptureVisibleTabOptions, callback: (dataUrl: string) => void): void {
        this.chrome.tabs.captureVisibleTab(options, callback);
    }

    public query(queryInfo: QueryInfo, callback: (result: Tab[]) => void): void {
        this.chrome.tabs.query(queryInfo, callback);
    }

    public create(createProperties: CreateProperties, callback?: (tab: Tab) => void): void {
        this.chrome.tabs.create(createProperties, callback);
    }
}
