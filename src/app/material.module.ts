import { NgModule } from '@angular/core';
import {
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, MatMenuModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
} from '@angular/material';

const modules: any[] = [
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule,
    MatButtonModule,
    MatRadioModule,
    MatSliderModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatChipsModule,
    MatExpansionModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
];

@NgModule({
    imports: [
        ...modules,
    ],
    exports: [
        ...modules,
    ],
})
export class MaterialModule {
}
