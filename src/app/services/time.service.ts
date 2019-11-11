import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    public static isAfter(date: string, compareTo: string): boolean {
        return new Date(date).getTime() > new Date(compareTo).getTime();
    }

    public static isSame(date: string, compareTo: string): boolean {
        return new Date(date).getTime() === new Date(compareTo).getTime();
    }
}
