import type {Category} from "./categorie";
import type {Attraction} from "./attraction";


export interface Activity {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    attractionId: number;
    createdAt: Date;
    updatedAt: Date;
}
