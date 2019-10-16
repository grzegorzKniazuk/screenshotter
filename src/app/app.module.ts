import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StorageModule } from '@ngx-pwa/local-storage';
import { RUNTIME_CHECKS, STORAGE_MODULE_CONFIG, STORE_ROUTER_CONNECTING_CONFIG } from 'src/app/constants';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from 'src/app/store';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DashboardComponent, ScreenshotGalleryComponent, SettingsComponent } from 'src/app/views';
import { DashboardNavComponent, ImageCardComponent } from 'src/app/components';
import { ImagesEffects } from 'src/app/store/images.effects';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ScreenshotGalleryComponent,
        SettingsComponent,
        ImageCardComponent,
        DashboardNavComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        StorageModule.forRoot(STORAGE_MODULE_CONFIG),
        StoreModule.forRoot(appReducers, { runtimeChecks: RUNTIME_CHECKS }),
        StoreRouterConnectingModule.forRoot(STORE_ROUTER_CONNECTING_CONFIG),
        EffectsModule.forRoot([ ImagesEffects ]),
        environment.production ? [] : [ StoreDevtoolsModule.instrument() ],
    ],
    providers: [],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
