import type {Category} from "./categorie";


export interface Attraction{
    id: number;
    name: string;
    description: string;
    categoryId: Category;
    createdAt: Date;
    updatedAt: Date;
}