import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Image } from 'src/app/interfaces/image';

@Component({
    selector: 'app-image-card',
    templateUrl: './image-card.component.html',
    styleUrls: [ './image-card.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCardComponent implements OnInit {

    @Input() public readonly image: Image;

    constructor() {
    }

    ngOnInit() {
    }

}
