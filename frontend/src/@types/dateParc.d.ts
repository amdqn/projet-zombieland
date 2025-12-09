export interface DateParc {
    id: number;
    jour: Date;
    openHour: Date;
    closeHour: Date;
    isOpen: boolean;
    notes: string;
    createdAt: Date;
}