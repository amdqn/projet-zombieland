export interface PointOfInterest {
    id: number;
    name: string;
    type: 'toilets' | 'shop' | 'entrance' | 'exit';
    description?: string | null;
    icon?: string | null;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
}
