import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ConflictAction, FileFormat } from 'src/app/enums';
import { Observable, Subscription } from 'rxjs';
import { tap, throttleTime } from 'rxjs/operators';
import { Settings } from 'src/app/interfaces';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { CLEAR_SCREENSHOTS_STORAGE, OPEN_BROWSER_TAB, OPEN_DOWNLOAD_FOLDER, UPDATE_SETTINGS } from 'src/app/store/actions';
import { ActivatedRoute } from '@angular/router';
import { SETTINGS_STORAGE_KEY } from 'src/app/constants';
import { Bind } from 'src/app/decorators';
import { ToastService } from 'src/app/services';
import { selectBytesInUse } from 'src/app/store/selectors';
import { Unsubscriber } from 'src/app/hocs';

@Unsubscriber()
@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: [ './settings.component.scss', '../dashboard.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {

    public readonly fileFormats = [ FileFormat.JPEG, FileFormat.PNG ];
    public readonly conflictActions = [ ConflictAction.UNIQUIFY, ConflictAction.OVERWRITE, ConflictAction.PROMPT ];
    public settingsForm: FormGroup;
    public readonly bytesInUse$: Observable<number> = this.store.pipe(select(selectBytesInUse));
    private readonly subscriptions$: Subscription = new Subscription();
    private readonly settings: Settings = this.activatedRoute.snapshot.data[SETTINGS_STORAGE_KEY];

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly store: Store<AppState>,
        private readonly activatedRoute: ActivatedRoute,
        private readonly toastService: ToastService,
    ) {
    }

    public get autoDownloadControl(): AbstractControl {
        return this.settingsForm.get('autoDownload');
    }

    public get notifyOnNewControl(): AbstractControl {
        return this.settingsForm.get('notifyOnNew');
    }

    public get alwaysShowSaveAsControl(): AbstractControl {
        return this.settingsForm.get('alwaysShowSaveAs');
    }

    private get fileQualityControl(): AbstractControl {
        return this.settingsForm.get('fileQuality');
    }

    ngOnInit() {
        this.buildForm();
        this.conditionallyDisableFileQuality(this.settings);
        this.watchForm();
    }

    public openDownloadFolder(): void {
        this.store.dispatch(OPEN_DOWNLOAD_FOLDER());
    }

    public clearStorage(): void {
        this.toastService.question('Are You sure want to delete all screenshots?').subscribe(() => {
            this.store.dispatch(CLEAR_SCREENSHOTS_STORAGE());
        });
    }

    public openExternalTab(url: string): void {
        this.store.dispatch(OPEN_BROWSER_TAB({ url }));
    }

    private buildForm(): void {
        this.settingsForm = this.formBuilder.group({
            autoDownload: [ this.settings.autoDownload ],
            fileFormat: [ this.settings.fileFormat || FileFormat.JPEG ],
            fileQuality: [ this.settings.fileQuality || 100 ],
            notifyOnNew: [ this.settings.notifyOnNew || false ],
            conflictAction: [ this.settings.conflictAction || ConflictAction.UNIQUIFY ],
            alwaysShowSaveAs: [ this.settings.alwaysShowSaveAs || false ],
        });
    }

    private watchForm(): void {
        this.subscriptions$.add(
            this.settingsForm.valueChanges.pipe(
                tap(this.conditionallyDisableFileQuality),
                throttleTime(500),
            ).subscribe(this.updateExtensionSettings),
        );
    }

    @Bind
    private conditionallyDisableFileQuality({ fileFormat }: Settings): void {
        if (!(fileFormat === FileFormat.JPEG) && !this.fileQualityControl.disabled) {
            this.fileQualityControl.disable({ onlySelf: true, emitEvent: false });
        } else if (fileFormat === FileFormat.JPEG && this.fileQualityControl.disabled) {
            this.fileQualityControl.enable({ onlySelf: true, emitEvent: false });
        }
    }

    @Bind
    private updateExtensionSettings(): void {
        this.store.dispatch(UPDATE_SETTINGS({ settings: { ...this.settingsForm.getRawValue() } }));
    }
}
