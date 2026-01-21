export interface ParkDate {
    id: number;
    jour: string; // Format "YYYY-MM-DD"
    open_hour: string;
    close_hour: string;
    is_open: boolean;
    notes: string | null;
    created_at: string;
}
