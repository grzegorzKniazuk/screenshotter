import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { unitOfTime } from 'moment';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    public static byFormat(format: string): string {
        return moment().format(format);
    }

    public static isAfter(data: string, compareTo: string, granularity?: unitOfTime.StartOf): boolean {
        return moment(data).isAfter(compareTo, granularity);
    }
}
