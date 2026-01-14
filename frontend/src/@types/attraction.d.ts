
import type { Category } from './categorie';

export interface Attraction {
    id: number;
    name: string;
    description: string;
    thrill_level?: number | null;
    duration?: number | null;
    image_url?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    category_id: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    category?: Category;
    images?: Array<{ id: number; url: string; alt_text?: string }>;
    activities?: Array<{ id: number; name: string }>;
    related_attractions?: Array<Attraction>;
}