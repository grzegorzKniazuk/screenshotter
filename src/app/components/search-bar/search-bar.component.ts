import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Unsubscriber } from 'src/app/hocs';

@Unsubscriber()
@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: [ './search-bar.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit {

    public searchForm: FormGroup;
    private readonly subscriptions$ = new Subscription();
    @Output() public readonly onSearch = new EventEmitter<string>();

    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.watchForm();
    }

    private buildForm() {
        this.searchForm = this.formBuilder.group({
            query: '',
        });
    }

    private watchForm() {
        this.subscriptions$.add(this.searchForm.get('query').valueChanges.subscribe((query: string) => this.onSearch.emit(query)));
    }
}
