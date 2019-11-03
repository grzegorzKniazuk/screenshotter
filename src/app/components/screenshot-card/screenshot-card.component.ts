import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Screenshot } from 'src/app/interfaces/screenshot';
import { DownloadScreenshotDto, PreviewScreenshotDto } from 'src/app/dto';
import { ScreenshotsEffects } from 'src/app/store/effects';

@Component({
    selector: 'app-screenshot-card',
    templateUrl: './screenshot-card.component.html',
    styleUrls: [ './screenshot-card.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenshotCardComponent {

    @Input() public readonly screenshot: Screenshot;
    @Output() public readonly onDelete = new EventEmitter<string>();
    @Output() public readonly onOpen = new EventEmitter<string>();
    @Output() public readonly onDownload = new EventEmitter<DownloadScreenshotDto>();
    @Output() public readonly onPreview = new EventEmitter<PreviewScreenshotDto>();

    public onScreenshotDelete(): void {
        this.onDelete.emit(this.screenshot.id);
    }

    public onOpenSource(): void {
        this.onOpen.emit(this.screenshot.url);
    }

    public onScreenshotDownload(): void {
        this.onDownload.emit(ScreenshotsEffects.createDownloadScreenshotDto(this.screenshot));
    }

    public onScreenshotPreview(): void {
        this.onPreview.emit({ data: this.screenshot.data });
    }
}
