import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Image } from 'src/app/interfaces/image';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: [ './image-card.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCardComponent {

    @Input() public readonly image: Image;
    @Output() public readonly onDelete = new EventEmitter<string>();

    public onScreenshotDelete(): void {
        this.onDelete.emit(this.image.id);
    }
}
