import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Screenshot } from 'src/app/interfaces/screenshot';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: [ './image-card.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCardComponent {

    @Input() public readonly image: Screenshot;
    @Output() public readonly onDelete = new EventEmitter<string>();
    @Output() public readonly onOpen = new EventEmitter<string>();

    public onScreenshotDelete(): void {
        this.onDelete.emit(this.image.id);
    }

    public onOpenSource(): void {
        this.onOpen.emit(this.image.url);
    }
}
