export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string | null;
  color: string | null;
  imageUrl: string;
}

export interface Cart {
  id: string;
  createdAt: string;
  items: CartItem[];
}
