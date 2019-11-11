import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { Bind } from 'lodash-decorators';
import DownloadOptions = chrome.downloads.DownloadOptions;

@Injectable({
    providedIn: 'root',
})
export class DownloadsService extends ApiService {

    public static browserDownloadsApiAvailability(): (source$: Observable<any>) => Observable<any> {
        return ApiService.browserApiAvailability('downloads');
    }

    public download(options: DownloadOptions, callback?: (downloadId: number) => void): void {
        this.chrome.downloads.download(options, callback);
    }

    @Bind
    public showDefaultFolder(): void {
        this.chrome.downloads.showDefaultFolder();
    }
}
