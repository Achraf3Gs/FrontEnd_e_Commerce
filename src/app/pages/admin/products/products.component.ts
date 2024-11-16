import { NgClass, NgFor, NgIf } from '@angular/common';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { Category } from '../../../model/Category';
import { CategoryService } from '../../../services/category/category.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, NgFor],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  isSidePanelVisible: boolean = false;

  productObj: any = {
    productId: 0,
    productSKU: '',
    productName: '',
    productPrice: 0,
    productShortName: '',
    productDescription: '',
    createdDate: new Date(),
    deliveryTimeSpan: '',
    productImageUrl: '',
    categoryId: 0,
  };

  categoryList: any;
  productsList: any;
  category!: Category;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private applicationRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.getAllCategory();
    this.getAllProducts();
  }
  onDelete(item: any) {
    const isDelete = confirm('Are you Sure want to delete');
    if (isDelete) {
      this.productService
        .deleteProduct(item.productId)
        .subscribe((res: any) => {
          if (res) {
            alert('Product Deleted');
            this.getAllProducts();
          } else {
            alert('Product not Deleted');
          }
        });
    }
  }
  onEdit(item: any) {
    this.productObj = { ...item }; // Copy all properties from item to productObj
    this.productObj.categoryId = item.category.categoryId; // Assign the nested categoryId
    this.isSidePanelVisible = true; // Show the side panel for editing
  }

  reset(id: any) {
    console.log(id);
    this.productService.getProductById(id).subscribe((res: any) => {
      console.log('product to reset:', res);
      if (res) {
        this.productObj = res;
      } else {
        alert(res.message);
      }
    });
  }

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe((response) => {
      this.categoryList = response;
      console.log('this.categoryList ', this.categoryList);
    });
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe((response) => {
      this.productsList = response;
      console.log('this.productsList ', this.productsList);
    });
  }

  OnSave() {
    console.log('Product Object:', this.productObj); // Log the productObj
    this.productService.createProduct(this.productObj).subscribe((res: any) => {
      if (res) {
        alert('Product Created Successfully');
        this.getAllProducts();
        this.isSidePanelVisible = false;
      } else {
        alert('Product not Created ');
      }
    });
  }

  OnUpdate() {
    this.productService.updateProduct(this.productObj).subscribe((res: any) => {
      if (res) {
        alert('Product Updatedd Successfully');
        this.isSidePanelVisible = false;
      } else {
        alert('Product not Updatedd Successfully');
      }
    });
  }

  openSidePanel() {
    // Reset the productObj to default values for creating a new product
    this.productObj = {
      productId: 0,
      productSKU: '',
      productName: '',
      productPrice: 0,
      productShortName: '',
      productDescription: '',
      createdDate: new Date(),
      deliveryTimeSpan: '',
      productImageUrl: '',
      categoryId: 0,
    };
    this.isSidePanelVisible = true;
  }

  closeSidePanel() {
    this.isSidePanelVisible = false;
  }
}
