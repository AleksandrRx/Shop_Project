import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from "rxjs/operators";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productCategory:ProductCategory[];

  // private baseUrl = "http://localhost:8080/api/products?size=100";
  private baseUrl = "http://localhost:8080/api/products";

  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyWord: string): Observable<Product[]>  {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyWord: string): Observable<GetResponseProducts>{

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    // need to build URL based on product id

    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  PoliceOn():Observable<string> {
    let policeUrl:string = "http://192.168.0.254:80/policeon";
    this.httpClient.get(policeUrl);
    console.log(policeUrl);
    return this.httpClient.get<GetResponseBlink>(policeUrl).pipe(map(data=>data.command));
  }
  PoliceOff():Observable<string> {
    let policeUrl:string = "http://192.168.0.254:80/policeoff";
    this.httpClient.get<GetResponseBlink>(policeUrl);
    console.log(policeUrl);
    return this.httpClient.get<GetResponseBlink>(policeUrl).pipe(map(data=>data.command));
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page:{
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

  interface GetResponseProductCategory {
  _embedded:{
    productCategory: ProductCategory[];
  }
}

  interface GetResponseBlink {
  command: string;
  }
