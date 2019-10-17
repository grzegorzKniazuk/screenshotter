import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, NewScreenshotComponent, ScreenshotGalleryComponent, SettingsComponent } from 'src/app/views';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            {
                path: '',
                redirectTo: 'new-screenshot',
                pathMatch: 'full',
            },
            {
                path: 'new-screenshot',
                component: NewScreenshotComponent,
            },
            {
                path: 'gallery',
                component: ScreenshotGalleryComponent,
            },
            {
                path: 'settings',
                component: SettingsComponent,
            },
        ],
    },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
})
export class AppRoutingModule {
}
