export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
  image_url?: string | null;
  category?: string;
  color?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
