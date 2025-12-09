import type {Category} from "./categorie";
import type {Attraction} from "./attraction";


export interface Activity {
    id: number;
    name: string;
    description: string;
    image_url?: string | null;
    category_id: number;
    attraction_id?: number | null;
    created_at: string;
    updated_at: string;
    category?: Category;
    attraction?: Attraction | null;
}
