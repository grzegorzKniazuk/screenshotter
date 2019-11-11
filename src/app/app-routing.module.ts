import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent, NewScreenshotComponent, ScreenshotGalleryComponent, SettingsComponent } from 'src/app/views';
import { SettingsResolver } from 'src/app/resolvers';
import { RoutesUrls } from 'src/app/enums';

const routes: Routes = [
    {
        path: '', component: DashboardComponent, children: [
            {
                path: '',
                redirectTo: RoutesUrls.NEW_SCREENSHOT,
                pathMatch: 'full',
            },
            {
                path: RoutesUrls.NEW_SCREENSHOT,
                component: NewScreenshotComponent,
            },
            {
                path: RoutesUrls.GALLERY,
                component: ScreenshotGalleryComponent,
            },
            {
                path: RoutesUrls.SETTINGS,
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
