import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: [ './icon.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit {
    @Input() public readonly size: string = '1';
    @Input() public readonly action: boolean = false;
    @Input() public readonly color = 'black';
    @Input() public readonly actionColor = '#3f51b5';
    @ViewChild(MatIcon, { static: true }) private readonly matIcon: MatIcon;

    constructor(
        private readonly renderer2: Renderer2,
    ) {
    }

    ngOnInit() {
        this.renderer2.setStyle(this.matIcon._elementRef.nativeElement, 'color', this.color);
    }

    @HostListener('mouseenter')
    public onMouseEnter(): void {
        if (this.action && this.matIcon) {
            this.renderer2.setStyle(this.matIcon._elementRef.nativeElement, 'color', this.actionColor);
        }
    }

    @HostListener('mouseleave')
    public onMouseLeave(): void {
        if (this.action && this.matIcon) {
            this.renderer2.setStyle(this.matIcon._elementRef.nativeElement, 'color', this.color);
        }
    }
}
