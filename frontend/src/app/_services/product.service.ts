import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductDto } from '../_models/product.dto';
import { Product } from '../_models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Product[]>(this.baseUrl + 'product');
  }

  get(id: string) {
    return this.http.get<Product>(this.baseUrl + 'product/' + id);
  }

  create(product: ProductDto) {
    return this.http.post<Product>(this.baseUrl + 'product', product);
  }

  update(id: string, product: ProductDto) {
    return this.http.put<Product>(this.baseUrl + 'product/' + id, product);
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + 'product/' + id);
  }
}
