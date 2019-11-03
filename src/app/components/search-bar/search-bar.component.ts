import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: [ './search-bar.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {

    @Output() public readonly onSearch = new EventEmitter<string>();
    public query = '';

    public onQueryChange(query: string): void {
        this.onSearch.emit(query);
    }
}
