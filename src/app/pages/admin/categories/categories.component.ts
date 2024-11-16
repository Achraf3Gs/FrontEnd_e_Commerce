import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { CategoryService } from '../../../services/category/category.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../model/Category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, NgFor, CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  isSidePanelVisible: boolean = false;
  categoryObj: Category = {
    categoryId: 0,
    categoryName: '',
    parentCategoryId: 0,
  };
  categoryList: any[] = [];
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getAllCategory();
    console.log(this.categoryList);
  }
  getAllCategory() {
    this.categoryService.getAllCategory().subscribe((res: any) => {
      this.categoryList = res;
      console.log('categoryList:', this.categoryList);
    });
  }

  onEdit(item: any) {
    this.categoryObj = item;
    this.isSidePanelVisible = true;
  }
  onDelete(id: any) {
    const isDelete = confirm('Are you Sure want to delete');
    if (isDelete) {
      console.log('item.categoryId :', id);
      this.categoryService.deleteCategory(id).subscribe((res: any) => {
        if (res) {
          alert('Category Deleted');
          this.getAllCategory();
        } else {
          alert(res.message);
        }
      });
    }
  }

  openSidePanel() {
    // Reset the categoryObj to default values for creating a new category
    this.categoryObj = {
      categoryId: 0,
      categoryName: '',
      parentCategoryId: 0,
    };
    this.isSidePanelVisible = true;
  }
  closeSidePanel() {
    this.isSidePanelVisible = false;
  }
  reset(id: any) {
    console.log(id);
    this.categoryService.getCategoryById(id).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.categoryObj = res;
      } else {
        alert(res?.message || 'Failed to fetch category details.');
        this.categoryObj = {
          categoryId: 0,
          categoryName: '',
          parentCategoryId: 0,
        };
      }
    });
  }

  OnSave() {
    console.log('this.categoryObj :', this.categoryObj);
    this.categoryService
      .createCategory(this.categoryObj)
      .subscribe((res: any) => {
        if (res) {
          alert('Category Created Successfully');
          this.getAllCategory();
          this.isSidePanelVisible = false;
        } else {
          console.log(res);
          alert('Category Not Created Successfully');
        }
      });
  }
  OnUpdate() {
    this.categoryService
      .updateCategory(this.categoryObj)
      .subscribe((res: any) => {
        if (res) {
          alert('Product Created Successfully');
          this.categoryService.getAllCategory();
          this.isSidePanelVisible = false;
        } else {
          alert(res.message);
        }
      });
  }
}
