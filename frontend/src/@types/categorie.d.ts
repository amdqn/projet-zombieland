export interface Category {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    activities?: Array<{
        id: number;
        name: string;
        description?: string;
        image_url?: string;
    }>;
    attractions?: Array<{
        id: number;
        name: string;
        description?: string;
        image_url?: string;
    }>;
    _count?: {
        activities: number;
        attractions: number;
    };
}