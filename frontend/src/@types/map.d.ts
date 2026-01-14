import type { Attraction } from './attraction';
import type { Activity } from './activity';
import type { PointOfInterest } from './pointOfInterest';
import type { Category } from './categorie';

export type MapPointType = 'attraction' | 'activity' | 'poi';

export interface MapPoint {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    type: MapPointType;
    description?: string;
    image_url?: string | null;
    thrill_level?: number | null;
    duration?: number | null;
    category?: Category;
    icon?: string;
    poi_type?: 'toilets' | 'shop' | 'entrance' | 'exit';
}

export interface MapFilters {
    search: string;
    categories: number[];
    types: MapPointType[];
    thrillLevel: [number, number];
}

export interface MapData {
    attractions: Attraction[];
    activities: Activity[];
    pois: PointOfInterest[];
}

export interface MapBounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}
