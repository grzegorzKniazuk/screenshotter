import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bytesTo',
    pure: true,
})
export class BytesToPipe implements PipeTransform {

    transform(value: number, convertTo: 'kb' | 'mb' | 'gb'): string {
        switch (convertTo) {
            case 'kb': {
                return `${value / Math.pow(1024, 1)}`;
            }
            case 'mb': {
                return `${value / Math.pow(1024, 2)}`;
            }
            case 'gb': {
                return `${value / Math.pow(1024, 4)}`;
            }
            default: {
                return `${value}`;
            }
        }
    }

}
