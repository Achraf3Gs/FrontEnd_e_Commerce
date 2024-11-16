import { Category } from './Category';

export type Product = {
  productId: number | undefined;
  productSKU: '';
  productName: '';
  productPrice: 0;
  productShortName: '';
  productDescription: '';
  CreatedDate: '';
  deliveryTimeSpan: '';
  productImageUrl: '';
  category: Category;
};
