import { NgModule } from '@angular/core';
import { MatBadgeModule, MatCardModule, MatIconModule, MatTabsModule } from '@angular/material';

const modules: any[] = [
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule,
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
