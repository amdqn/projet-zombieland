export interface DateParc {
    id: number;
    jour: Date;
    openHour: string | null; // Format "HH:mm:ss"
    closeHour: string | null; // Format "HH:mm:ss"
    isOpen: boolean;
    notes: string;
    createdAt: Date;
}