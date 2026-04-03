import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private editingProductSubject = new BehaviorSubject<Product | null>(null);
  editingProduct$ = this.editingProductSubject.asObservable();

  private toastSubject = new BehaviorSubject<{message: string, isError: boolean} | null>(null);
  toast$ = this.toastSubject.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  setEditingProduct(product: Product | null) {
    this.editingProductSubject.next(product);
  }

  showToast(message: string, isError: boolean = false) {
    this.toastSubject.next({ message, isError });
    setTimeout(() => this.toastSubject.next(null), 3000);
  }
}
