import { NgModule } from '@angular/core';
import { MatBadgeModule, MatButtonModule, MatCardModule, MatIconModule, MatTabsModule } from '@angular/material';

const modules: any[] = [
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatBadgeModule,
    MatButtonModule,
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
