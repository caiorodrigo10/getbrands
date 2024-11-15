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

export interface ProjectSpecificProduct {
  id: string;
  name: string | null;
  description: string | null;
  image_url: string | null;
  selling_price: number | null;
}

export interface ProjectProduct {
  id: string;
  project: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  product: Product;
  specific: ProjectSpecificProduct[] | null;
}