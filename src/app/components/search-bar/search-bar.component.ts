import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: [ './search-bar.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit, OnDestroy {

    public searchForm: FormGroup;
    public isSearchBarOpened$ = new BehaviorSubject<boolean>(false);
    @Output() public readonly onSearch = new EventEmitter<string>();
    private readonly subscriptions$ = new Subscription();

    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.watchQuery();
    }

    ngOnDestroy() {
        this.subscriptions$.unsubscribe();
    }

    private buildForm(): void {
        this.searchForm = this.formBuilder.group({
            query: [ '' ],
        });
    }

    private watchQuery(): void {
        this.subscriptions$.add(this.queryControl.valueChanges.subscribe((query: string) => this.onSearch.emit(query)));
    }

    private get queryControl(): AbstractControl {
        return this.searchForm.get('query');
    }

    public openSearchBar(): void {
        this.isSearchBarOpened$.next(true);
    }

    public onInputFocusOut(): void {
        this.isSearchBarOpened$.next(false);
    }

}
