export interface ProductSize {
  id: string;
  name: string;
  price: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes: ProductSize[];
  selectedSize: string | null;
}

export interface StepTwoData {
  product: ProductDetail;
  selectedSizeId: string | null;
  quantity: number;
}
