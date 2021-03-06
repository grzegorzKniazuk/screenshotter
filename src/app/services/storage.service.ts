import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StorageService extends ApiService {

    public static browserStorageApiAvailability(): (source$: Observable<any>) => Observable<any> {
        return ApiService.browserApiAvailability('storage');
    }

    public get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void {
        this.chrome.storage.local.get(keys, callback);
    }

    public set(items: object, callback?: () => void): void {
        this.chrome.storage.local.set(items, callback);
    }

    public remove(keys: string | string[], callback?: () => void): void {
        this.chrome.storage.local.remove(keys, callback);
    }

    public clear(callback?: () => void): void {
        this.chrome.storage.local.clear(callback);
    }

    public getBytesInUse(callback: (bytesInUse: number) => void): void {
        this.chrome.storage.local.getBytesInUse(callback);
    }
}
