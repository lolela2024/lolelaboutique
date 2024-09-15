export type Cart = {
  cartId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discountAmount: number;
    discountPercentage: number;
    quantity: number;
    imageString: string;
  }>;
};
