import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Order, OrderBy } from 'src/app/enums';
import { SearchParamsDto } from 'src/app/dto/search-params.dto';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: [ './search-bar.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit, OnDestroy {

    private readonly subscriptions$ = new Subscription();
    public searchForm: FormGroup;
    public searchOrder: Order = Order.ASC;
    public orderBy: OrderBy = OrderBy.Date;
    public readonly orderByOptions: OrderBy[] = [ OrderBy.Date, OrderBy.Name, OrderBy.Quality, OrderBy.Size ];
    public onSearch = new EventEmitter<SearchParamsDto>();

    constructor(
        private readonly formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.buildForm();
    }

    ngOnDestroy() {
        this.subscriptions$.unsubscribe();
    }

    private buildForm(): void {
        this.searchForm = this.formBuilder.group({
            query: [ '' ],
        });
    }

    public setSearchOrder(): void {
        if (this.searchOrder === Order.ASC) {
            this.searchOrder = Order.DESC;
        } else {
            this.searchOrder = Order.ASC;
        }
    }

    public setOrderBy(orderBy: OrderBy): void {
        this.orderBy = orderBy;
    }
}
