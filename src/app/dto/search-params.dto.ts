import { Order, OrderBy } from 'src/app/enums';

export interface SearchParamsDto {
    query: string;
    order: Order;
    orderBy: OrderBy;
}
