export interface IPrice {
    id: number;
    label: string;
    type: PriceType;
    amount: number;
    duration_days: number;
    created_at: Date;
    updated_at: Date;
}

export type PriceType = 'ADULTE' | 'ETUDIANT' | 'GROUPE' | 'PASS_2J';

