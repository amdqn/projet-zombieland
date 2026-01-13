import type {Category} from "./categorie";
import type {Attraction} from "./attraction";


export interface Activity {
    id: number;
    name: string;
    description: string;
    thrill_level?: number | null;
    duration?: number | null;
    image_url?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    category_id: number;
    attraction_id?: number | null;
    created_at: string;
    updated_at: string;
    category?: Category;
    attraction?: Attraction | null;
}
