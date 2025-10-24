export type Category = {
    id: string;
    name: string;
    parent: string | null;
    image: string;
    created_at: string;
    updated_at: string;
}

export type Brand = {
    id: string;
    name: string;
    description: string;
    image: string;
}
