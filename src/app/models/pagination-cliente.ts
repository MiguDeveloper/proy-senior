import { Cliente } from './cliente';
export interface PaginationCliente {
    content: Cliente[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    sort: Sort;
    first: boolean;
    empty: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    paged: boolean;
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}
