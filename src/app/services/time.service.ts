import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class TimeService {

    public byFormat(format: string): string {
        return moment().format(format);
    }
}
