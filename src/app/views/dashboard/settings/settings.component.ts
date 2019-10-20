import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ConflictAction, FileFormat } from 'src/app/enums';
import { Subscription } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { Settings } from 'src/app/interfaces';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { OPEN_DOWNLOAD_FOLDER, UPDATE_SETTINGS } from 'src/app/store/actions';
import { ActivatedRoute } from '@angular/router';
import { SETTINGS_STORAGE_KEY } from 'src/app/constants';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: [ './settings.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {

    public readonly fileFormats = [ FileFormat.JPEG, FileFormat.PNG ];
    public readonly conflictActions = [ ConflictAction.UNIQUIFY, ConflictAction.OVERWRITE, ConflictAction.PROMPT ];
    public settingsForm: FormGroup;
    private readonly subscriptions$: Subscription = new Subscription();
    private settings: Settings = this.activatedRoute.snapshot.data[SETTINGS_STORAGE_KEY];

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly store: Store<AppState>,
        private readonly activatedRoute: ActivatedRoute,
    ) {
    }

    public get alwaysShowSaveAsControl(): AbstractControl {
        return this.settingsForm.get('alwaysShowSaveAs');
    }

    private get fileQualityControl(): AbstractControl {
        return this.settingsForm.get('fileQuality');
    }

    ngOnInit() {
        this.buildForm();
        this.conditionallyDisableFileQuality(this.settings.fileFormat);
        this.watchForm();
    }

    ngOnDestroy() {
        this.subscriptions$.unsubscribe();
    }

    public openDownloadFolder(): void {
        this.store.dispatch(OPEN_DOWNLOAD_FOLDER());
    }

    private buildForm(): void {
        this.settingsForm = this.formBuilder.group({
            fileFormat: [ this.settings.fileFormat || FileFormat.JPEG ],
            fileQuality: [ this.settings.fileQuality || 100 ],
            conflictAction: [ this.settings.conflictAction || ConflictAction.UNIQUIFY ],
            alwaysShowSaveAs: [ this.settings.alwaysShowSaveAs || false ],
        });
    }

    private watchForm(): void {
        this.settingsForm.valueChanges.pipe(
            tap(({ fileFormat }: Settings) => this.conditionallyDisableFileQuality(fileFormat)),
            throttleTime(500),
        ).subscribe(() => {
            this.store.dispatch(UPDATE_SETTINGS({ settings: { ...this.settingsForm.getRawValue() } }));
        });
    }

    private conditionallyDisableFileQuality(fileFormat: FileFormat): void {
        if (!(fileFormat === FileFormat.JPEG) && !this.fileQualityControl.disabled) {
            this.fileQualityControl.disable({ onlySelf: true, emitEvent: false });
        } else if (fileFormat === FileFormat.JPEG && this.fileQualityControl.disabled) {
            this.fileQualityControl.enable({ onlySelf: true, emitEvent: false });
        }
    }
}
