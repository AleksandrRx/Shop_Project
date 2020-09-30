import { Component, OnInit } from '@angular/core';
import {ProductCategory} from "../../common/product-category";
import {ProductService} from "../../services/product.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories()
  }

    listProductCategories(){
      this.productService.getProductCategories().subscribe(
        data => {
          console.log('Product Categories= ' + JSON.stringify(data));
          this.productCategories = data;
        }
      )
    }

  PoliceOn() {
    this.productService.PoliceOn().subscribe(data => data.toString());
  }

  PoliceOff() {
    this.productService.PoliceOff().subscribe(data => data.toString());
  }

}
