export interface Price {
    id: number;
    label: string;
    type: PriceType;
    amount: number;
    durationDays: number;
    createdAt: Date;
    updatedAt: Date;
}

export type PriceType = 'ADULTE' | 'ETUDIANT' | 'GROUPE' | 'PASS_2J';

