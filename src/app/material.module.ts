import { NgModule } from '@angular/core';
import {
    MatBadgeModule,
    MatButtonModule,
    MatCardModule, MatChipsModule, MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSliderModule,
    MatTabsModule, MatTooltipModule,
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
];

@NgModule({
    imports: [
        ...modules,
    ],
    exports: [
        ...modules,
    ]
})
export class MaterialModule {
}
