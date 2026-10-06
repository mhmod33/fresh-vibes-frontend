export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  image_url?: string;
  category?: string;
  color?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
