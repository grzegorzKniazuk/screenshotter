import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, NewScreenshotComponent, ScreenshotGalleryComponent, SettingsComponent } from 'src/app/views';
import { SettingsResolver } from 'src/app/resolvers';

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
                resolve: { 'screenshot-settings': SettingsResolver },
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
