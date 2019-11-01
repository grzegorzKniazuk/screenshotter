import { Injectable } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Observable } from 'rxjs';
import { filter, first, pluck } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ToastService {

    private readonly baseToastSettings: Partial<SweetAlertOptions> = {
        position: 'bottom-right',
        timer: 5000,
        toast: true,
        showConfirmButton: false,
        customContainerClass: 'toast-container',
    };

    public error(text: string, onAfterClose?: () => void): Promise<SweetAlertResult> {
        return this.open({
            titleText: text,
            type: 'error',
            onAfterClose,
        });
    }

    public success(text: string, onAfterClose?: () => void): Promise<SweetAlertResult> {
        return this.open({
            titleText: text,
            type: 'success',
            onAfterClose,
        });
    }

    public question(title: string, question = ''): Observable<SweetAlertResult> {
        return fromPromise(this.open({
            title,
            text: question,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Agree',
            showConfirmButton: true,
            showCancelButton: true,
            showCloseButton: false,
            type: 'question',
            toast: false,
            position: 'center',
            timer: undefined,
            allowOutsideClick: false,
        })).pipe(
            first(),
            pluck('value'),
            filter(Boolean),
        );
    }

    private open(settings: SweetAlertOptions): Promise<SweetAlertResult> {
        return swal.fire({
            ...this.baseToastSettings,
            ...settings,
        });
    }
}
