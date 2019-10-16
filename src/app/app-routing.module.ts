import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, ScreenshotGalleryComponent, SettingsComponent } from 'src/app/views';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            {
                path: '',
                redirectTo: 'gallery',
                pathMatch: 'full',
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
