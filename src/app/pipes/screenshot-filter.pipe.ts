import { Pipe, PipeTransform } from '@angular/core';
import { Screenshot } from 'src/app/interfaces';

@Pipe({
    name: 'screenshotFilter',
    pure: true,
})
export class ScreenshotFilterPipe implements PipeTransform {

    transform(value: Screenshot[], query: string): Screenshot[] {
        if (query) {
            return value.filter((screenshot: Screenshot) => screenshot.title.includes(query));
        } else {
            return value;
        }
    }
}
