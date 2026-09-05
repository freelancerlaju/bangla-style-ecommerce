export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  saveAmount?: number;
  imageUrl: string;
  category?: string;
  description?: string;
}
