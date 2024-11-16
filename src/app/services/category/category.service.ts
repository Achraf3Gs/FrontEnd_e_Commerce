import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Constant } from '../constant/constant';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../model/Category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  urlProducts = environment.urlProducts;
  urlCategory = environment.urlCategory;
  category: any;
  constructor(private http: HttpClient) {}

  getAllCategory() {
    return this.http.get(this.urlCategory + '/list');
  }

  createCategory(obj: any) {
    this.category = {
      categoryName: obj.categoryName,
      parentCategoryId: obj.parentCategoryId,
    };
    console.log(this.category);
    return this.http.post(this.urlCategory + '/add', this.category);
  }
  updateCategory(category: Category): Observable<any> {
    return this.http.put(
      this.urlCategory + '/' + category.categoryId,
      category
    );
  }

  deleteCategory(id: number) {
    return this.http.delete(this.urlCategory + '/delete/' + id);
  }
  getCategoryById(id: number) {
    return this.http.get<Category>(this.urlCategory + '/' + id);
  }
}
