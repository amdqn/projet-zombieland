export interface Price {
    id: number;
    label: string;
    type: PriceType;
    amount: number;
    duration_days: number;
    created_at: string; // ISO string format date-time
    updated_at: string; // ISO string format date-time
}

export type PriceType = 'ETUDIANT' | 'ADULTE' | 'GROUPE' | 'PASS_2J';

export interface PaginedPrices {
    data: Price[];
    total: number;
    page: number;
    limit: number;
}

export interface PricesFilters {
    priceType?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    amount?: number;
}

