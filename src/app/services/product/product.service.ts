import { CategoryService } from './../category/category.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Constant } from '../constant/constant';
import { environment } from '../../environments/environment';
import { Product } from '../../model/Product';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  urlProducts = environment.urlProducts;
  urlCategory = environment.urlCategory;
  product: any;

  http = inject(HttpClient);
  categoryService = inject(CategoryService);
  getAllCategory() {
    return this.http.get(this.urlCategory + '/list');
  }

  getAllProducts() {
    return this.http.get(this.urlProducts + '/list');
  }

  createProduct(obj: any) {
    this.product = {
      productSKU: obj.productSKU, // Ensure correct access to properties
      productName: obj.productName,
      productPrice: obj.productPrice,
      productShortName: obj.productShortName,
      productDescription: obj.productDescription,
      createdDate: obj.createdDate,
      deliveryTimeSpan: obj.deliveryTimeSpan,
      productImageUrl: obj.productImageUrl,
    };
    console.log('Created product object:', this.product);
    return this.http.post(
      `${this.urlProducts}/add/${obj.categoryId}`, // Access categoryId correctly
      this.product
    );
  }

  updateProduct(product: Product): Observable<any> {
    console.log(
      `${this.urlProducts}/update/${product.category.categoryId}/${product.productId}`,
      product
    );
    console.log('product.category:', product.category);
    return this.http.put(
      `${this.urlProducts}/update/${product.category.categoryId}/${product.productId}`,
      product
    );
  }

  deleteProduct(id: number) {
    
    return this.http.delete(this.urlProducts + '/delete/' + id);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.urlProducts + '/' + id);
  }
}
