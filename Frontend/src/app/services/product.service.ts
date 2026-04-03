import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:5185';
  private readonly API_URL = `${this.BASE_URL}/api/products`;
  private readonly UPLOAD_URL = `${this.BASE_URL}/api/upload`;

  getFullImageUrl(path: string | undefined): string {
    if (!path) return 'https://via.placeholder.com/200?text=No+Image';
    if (path.startsWith('http')) return path;
    return `${this.BASE_URL}${path}`;
  }

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor() {
    this.refreshProducts();
  }

  async refreshProducts() {
    try {
      const data = await firstValueFrom(this.http.get<Product[]>(this.API_URL));
      this.productsSubject.next(data);
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  }

  async addProduct(product: Partial<Product>) {
    await firstValueFrom(this.http.post<Product>(this.API_URL, product));
    await this.refreshProducts();
  }

  async updateProduct(product: Product) {
    await firstValueFrom(this.http.put(`${this.API_URL}/${product.id}`, product));
    await this.refreshProducts();
  }

  async deleteProduct(id: number) {
    await firstValueFrom(this.http.delete(`${this.API_URL}/${id}`));
    await this.refreshProducts();
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const resp = await firstValueFrom(this.http.post<{url: string}>(this.UPLOAD_URL, formData));
    return resp.url;
  }
}
