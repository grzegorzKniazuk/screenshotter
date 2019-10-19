import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Settings } from 'src/app/interfaces';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Observable } from 'rxjs';
import { selectSettingsState } from 'src/app/store/selectors';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SettingsResolver implements Resolve<Settings> {

    constructor(
        private store: Store<AppState>,
    ) {
    }

    public resolve(): Observable<Settings> {
        return this.store.pipe(
            first(),
            select(selectSettingsState),
        );
    }
}
