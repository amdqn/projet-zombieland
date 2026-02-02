import type {UpdateActivityDto} from "../services/activities.ts";

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
    pagination : {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }

}

export interface PricesFilters {
    priceType?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    amount?: number;
}

export interface UpdatePriceDto {
    label: string;
    label_en?: string | null;
    type: PriceType;
    amount: number;
    duration_days: number;
}

export interface CreatePriceDto {
    label: string;
    label_en?: string | null;
    type: PriceType;
    amount: number;
    duration_days: number;
}