export interface Product {
    id: string;
    brand: string | { id: string; name: string };
    product_name: string;
    price: number;
    slug: string;    
    images: string[];
    cover_image?: string;
    description: string;
    category: {
        id: string;
        name: string;
    };

}