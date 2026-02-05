export interface Category {
    id: string; // slug
    label: string;
    icon: string; // Lucide icon name
    order: number;
    description?: string;
}

export interface CategoryStats {
    categoryId: string;
    count: number;
}
