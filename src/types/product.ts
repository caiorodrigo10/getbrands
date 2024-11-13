export interface Product {
  id: string;
  category: string;
  name: string;
  description: string | null;
  image_url: string | null;
  from_price: number;
  srp: number;
  is_new: boolean | null;
  is_tiktok: boolean | null;
  created_at: string;
  updated_at: string;
}