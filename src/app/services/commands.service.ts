import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
    providedIn: 'root',
})
export class CommandsService extends ApiService {
    public get browserCommandsApiAvailability(): boolean {
        return this.browserApiAvailability('commands');
    }

    public onCommand(callback: (command: string) => void): void {
        this.chrome.commands.onCommand.addListener(callback);
    }
}
