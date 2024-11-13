export interface Product {
  id: number;
  category: string;
  name: string;
  image: string;
  fromPrice: number;
  srp: number;
  profit: number;
  isNew?: boolean;
  isTiktok?: boolean;
}