import { NgModule } from '@angular/core';
import { MatCardModule, MatIconModule, MatTabsModule } from '@angular/material';

const modules: any[] = [
    MatTabsModule,
    MatIconModule,
    MatCardModule
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
