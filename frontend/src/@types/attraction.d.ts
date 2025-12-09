
import type { Category } from './categorie';

export interface Attraction {
    id: number;
    name: string;
    description: string;
    category_id: number;
    created_at: string;
    updated_at: string;
    category?: Category;
    images?: Array<{ id: number; url: string; alt_text?: string }>;
}