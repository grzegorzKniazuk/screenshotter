import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from 'src/app/interfaces/image';
import { IMAGE_STORAGE_KEY } from 'src/app/constants/storage-keys';
import { filter, first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ImageService {

    public readonly images$: BehaviorSubject<Image[]> = new BehaviorSubject<Image[]>([]);

    constructor(
        private readonly storageMap: StorageMap,
    ) {
    }

    public loadImages(): void {
        (this.storageMap.get<Image[]>(IMAGE_STORAGE_KEY) as Observable<Image[]>).pipe(
            first(),
            filter((images: Image[] | undefined) => this.isArray(images)),
        ).subscribe((images: Image[]) => {
            this.images$.next(images);
        });
    }

    public saveImage(image: Image): void {
        this.images$.pipe(
            first(),
        ).subscribe((images: Image[]) => {
            this.storageMap.set(IMAGE_STORAGE_KEY, [ ...images, image ]).subscribe(() => {
                this.images$.next([ ...images, image ]);
            });
        });
    }

    public downloadImage(imageData: string): void {
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        downloadLink.href = imageData;
        downloadLink.target = '_self';
        downloadLink.download = 'file.png';
        downloadLink.click();
    }


    private isArray(value: any): boolean {
        return Object.prototype.toString.call(value).includes('Array');
    }
}
