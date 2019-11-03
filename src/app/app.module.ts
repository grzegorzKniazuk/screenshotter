import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RUNTIME_CHECKS, STORE_ROUTER_CONNECTING_CONFIG } from 'src/app/constants';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from 'src/app/store';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DashboardComponent, NewScreenshotComponent, ScreenshotGalleryComponent, SettingsComponent } from 'src/app/views';
import { DashboardNavComponent, IconComponent, ScreenshotCardComponent, SearchBarComponent } from 'src/app/components';
import { AppEffects, ScreenshotsEffects, SettingsEffects } from 'src/app/store/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BytesToPipe } from 'src/app/pipes';
import { LazyLoadImageDirective } from 'src/app/directives';

const entryComponents: any[] = [];

const components: any[] = [
    ...entryComponents,
    AppComponent,
    DashboardComponent,
    ScreenshotGalleryComponent,
    SettingsComponent,
    DashboardNavComponent,
    NewScreenshotComponent,
    IconComponent,
    ScreenshotCardComponent,
    SearchBarComponent,
];

const pipes: any[] = [
    BytesToPipe,
];

const directives: any[] = [
    LazyLoadImageDirective,
];

const modules: any[] = [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
];

const store: any[] = [
    StoreModule.forRoot(appReducers, { runtimeChecks: RUNTIME_CHECKS }),
    StoreRouterConnectingModule.forRoot(STORE_ROUTER_CONNECTING_CONFIG),
    EffectsModule.forRoot([ AppEffects, ScreenshotsEffects, SettingsEffects ]),
    environment.production ? [] : [ StoreDevtoolsModule.instrument() ],
];

@NgModule({
    declarations: [
        ...components,
        ...pipes,
        ...directives,
    ],
    entryComponents: [
        ...entryComponents,
    ],
    imports: [
        ...modules,
        ...store,
    ],
    providers: [
        ...pipes,
    ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
